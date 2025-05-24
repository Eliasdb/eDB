using System.IdentityModel.Tokens.Jwt;
using System.Net.Http.Headers;
using System.Security.Claims;
using System.Text;
using System.Text.Json;
using Edb.PlatformAPI.Config;
using Edb.PlatformAPI.DTOs.Profile;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;

namespace Edb.PlatformAPI.Controllers;

public class ProfileController(IOptions<KeycloakSettings> kcOptions) : BaseApiController
{
  private readonly KeycloakSettings _kc = kcOptions.Value;

  [HttpGet("userinfo")]
  [Authorize]
  public async Task<IActionResult> GetKeycloakUserInfo()
  {
    var accessToken = HttpContext.Request.Headers.Authorization.FirstOrDefault()?.Split(" ").Last();

    if (string.IsNullOrEmpty(accessToken))
    {
      return Unauthorized(new { error = "Unauthorized", message = "Missing access token." });
    }

    using var httpClient = new HttpClient();
    httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue(
      "Bearer",
      accessToken
    );
    httpClient.DefaultRequestHeaders.Accept.Add(
      new MediaTypeWithQualityHeaderValue("application/json")
    );

    var userInfoUrl = $"{_kc.BaseUrl}/realms/{_kc.Realm}/protocol/openid-connect/userinfo";
    var response = await httpClient.GetAsync(userInfoUrl);

    if (!response.IsSuccessStatusCode)
    {
      var error = await response.Content.ReadAsStringAsync();
      return StatusCode(
        (int)response.StatusCode,
        new
        {
          error = "FailedToFetch",
          message = $"Keycloak returned status {response.StatusCode}",
          details = error,
        }
      );
    }

    var content = await response.Content.ReadAsStringAsync();
    return Content(content, "application/json");
  }

  [HttpPut("update")]
  [Authorize]
  public async Task<IActionResult> UpdateKeycloakUserInfo([FromBody] ProfileUpdateRequest dto)
  {
    var accessToken = HttpContext.Request.Headers.Authorization.FirstOrDefault()?.Split(" ").Last();

    if (string.IsNullOrWhiteSpace(accessToken))
    {
      return Unauthorized(new { error = "Unauthorized", message = "Missing access token." });
    }

    var handler = new JwtSecurityTokenHandler();
    var jwt = handler.ReadJwtToken(accessToken);
    var userId = jwt.Subject;

    var adminToken = await GetAdminAccessToken();

    var client = new HttpClient();
    client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue(
      "Bearer",
      adminToken
    );
    client.DefaultRequestHeaders.Accept.Add(
      new MediaTypeWithQualityHeaderValue("application/json")
    );

    var updateBody = new
    {
      firstName = dto.FirstName,
      lastName = dto.LastName,
      email = dto.Email,
      username = dto.Username,
      // ❗ Do NOT send username – Keycloak considers it read-only
    };

    var json = JsonSerializer.Serialize(updateBody);
    var content = new StringContent(json, Encoding.UTF8, "application/json");

    var updateUrl = $"{_kc.BaseUrl}/admin/realms/{_kc.Realm}/users/{userId}";
    var result = await client.PutAsync(updateUrl, content);
    var responseBody = await result.Content.ReadAsStringAsync();

    if (!result.IsSuccessStatusCode)
    {
      Console.WriteLine($"Failed to update user: {result.StatusCode}");
      Console.WriteLine($"Response body: {responseBody}");

      return StatusCode(
        (int)result.StatusCode,
        new { error = "UpdateFailed", message = $"Failed to update user info: {responseBody}" }
      );
    }

    return Ok(new { message = "User info updated successfully" });
  }

  [HttpGet("otp-devices")]
  [Authorize]
  public async Task<IActionResult> GetOtpDevices()
  {
    var userId = User.FindFirst("sub")?.Value ?? User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

    if (userId is null)
      return Unauthorized("Missing subject claim.");

    var adminToken = await GetAdminAccessToken();

    using var client = new HttpClient();
    client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue(
      "Bearer",
      adminToken
    );

    var url = $"{_kc.BaseUrl}/admin/realms/{_kc.Realm}/users/{userId}/credentials";
    var res = await client.GetAsync(url);

    if (!res.IsSuccessStatusCode)
      return StatusCode((int)res.StatusCode, "Keycloak admin call failed.");

    var allCreds = JsonSerializer.Deserialize<List<JsonElement>>(
      await res.Content.ReadAsStringAsync()
    )!;
    var otpOnly = allCreds.Where(c => c.GetProperty("type").GetString() == "otp");

    return Ok(otpOnly);
  }

  [HttpDelete("otp-devices/{credId}")]
  [Authorize]
  public async Task<IActionResult> DeleteOtpDevice(string credId)
  {
    var userId = User.FindFirst("sub")?.Value ?? User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

    if (userId is null)
      return Unauthorized("Missing subject claim.");

    var adminToken = await GetAdminAccessToken();

    using var client = new HttpClient();
    client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue(
      "Bearer",
      adminToken
    );

    var url = $"{_kc.BaseUrl}/admin/realms/{_kc.Realm}/users/{userId}/credentials/{credId}";
    var res = await client.DeleteAsync(url);

    return res.IsSuccessStatusCode
      ? NoContent()
      : StatusCode((int)res.StatusCode, "Delete failed in Keycloak.");
  }

  /* ────────────────────────────────────────────────────────────── */
  /*  POST /api/profile/change-password                             */
  /* ────────────────────────────────────────────────────────────── */
  [HttpPost("change-password")]
  [Authorize]
  public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordRequest dto)
  {
    var userId = User.FindFirst("sub")?.Value ?? User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
    if (userId is null)
      return Unauthorized("Missing subject claim.");

    var adminToken = await GetAdminAccessToken();

    using var client = new HttpClient();
    client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue(
      "Bearer",
      adminToken
    );
    client.DefaultRequestHeaders.Accept.Add(
      new MediaTypeWithQualityHeaderValue("application/json")
    );

    /* 1. reset-password */
    var body = new
    {
      type = "password",
      value = dto.Password,
      temporary = false,
    };
    var res = await client.PutAsync(
      $"{_kc.BaseUrl}/admin/realms/{_kc.Realm}/users/{userId}/reset-password",
      new StringContent(JsonSerializer.Serialize(body), Encoding.UTF8, "application/json")
    );

    if (!res.IsSuccessStatusCode)
      return StatusCode((int)res.StatusCode, "Password update failed in Keycloak.");

    /* 2. optionally terminate other sessions */
    if (dto.SignOutOthers)
    {
      await client.PostAsync($"{_kc.BaseUrl}/admin/realms/{_kc.Realm}/users/{userId}/logout", null);
    }

    return Ok(new { message = "Password updated successfully" });
  }

  [HttpGet("password-meta")]
  [Authorize]
  public async Task<IActionResult> GetPasswordMeta()
  {
    // 1) find the user’s ID from the JWT
    var userId = User.FindFirst("sub")?.Value ?? User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
    if (userId is null)
      return Unauthorized("Missing subject claim.");

    // 2) get an admin token to call Keycloak’s Admin API
    var adminToken = await GetAdminAccessToken();

    // 3) fetch all credentials for the user
    using var client = new HttpClient();
    client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue(
      "Bearer",
      adminToken
    );

    var url = $"{_kc.BaseUrl}/admin/realms/{_kc.Realm}/users/{userId}/credentials";
    var res = await client.GetAsync(url);
    if (!res.IsSuccessStatusCode)
      return StatusCode((int)res.StatusCode, "Keycloak call failed.");

    // 4) parse the JSON, find the “password” credential
    var json = await res.Content.ReadAsStringAsync();
    var allCreds = JsonSerializer.Deserialize<List<JsonElement>>(json)!;
    var pwd = allCreds.FirstOrDefault(c => c.GetProperty("type").GetString() == "password");

    // 5) return only its createdDate
    return Ok(new { createdDate = pwd.GetProperty("createdDate").GetInt64() });
  }

  [HttpGet("sessions")]
  [Authorize]
  public async Task<IActionResult> GetUserSessions()
  {
    var userId = User.FindFirst("sub")?.Value ?? User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
    if (userId is null)
      return Unauthorized("Missing subject claim.");

    var adminToken = await GetAdminAccessToken();

    using var client = new HttpClient();
    client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue(
      "Bearer",
      adminToken
    );

    var url = $"{_kc.BaseUrl}/admin/realms/{_kc.Realm}/users/{userId}/sessions";
    var res = await client.GetAsync(url);

    if (!res.IsSuccessStatusCode)
      return StatusCode((int)res.StatusCode, "Keycloak session fetch failed.");

    var sessions = JsonDocument.Parse(await res.Content.ReadAsStringAsync());

    // You can extract & shape the data however you'd like before returning it
    return Ok(sessions);
  }

  [HttpDelete("sessions/{sessionId}")]
  [Authorize]
  public async Task<IActionResult> RevokeSession(string sessionId)
  {
    var adminToken = await GetAdminAccessToken();

    using var client = new HttpClient();
    client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue(
      "Bearer",
      adminToken
    );

    var url = $"{_kc.BaseUrl}/admin/realms/{_kc.Realm}/sessions/{sessionId}";
    var res = await client.DeleteAsync(url);

    return res.IsSuccessStatusCode
      ? NoContent()
      : StatusCode((int)res.StatusCode, "Failed to revoke session");
  }

  [HttpGet("applications")]
  [Authorize]
  public async Task<IActionResult> GetApplications()
  {
    var userId = User.FindFirst("sub")?.Value ?? User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
    if (userId is null)
      return Unauthorized("Missing subject claim.");

    var adminToken = await GetAdminAccessToken();

    using var client = new HttpClient();
    client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue(
      "Bearer",
      adminToken
    );

    var url = $"{_kc.BaseUrl}/admin/realms/{_kc.Realm}/users/{userId}/sessions";
    var sessionRes = await client.GetAsync(url);
    if (!sessionRes.IsSuccessStatusCode)
      return StatusCode((int)sessionRes.StatusCode, "Keycloak session fetch failed.");

    var sessionsJson = await sessionRes.Content.ReadAsStringAsync();
    var sessions = JsonSerializer.Deserialize<List<JsonElement>>(sessionsJson)!;

    var knownClients = new Dictionary<string, (string name, string url)>
    {
      { "edb-app", ("eDB App", "http://localhost:4200") },
      { "account-console", ("Account Console", $"{_kc.BaseUrl}/realms/{_kc.Realm}/account/") },
    };

    var found = new Dictionary<string, object>();

    foreach (var session in sessions)
    {
      if (!session.TryGetProperty("clients", out var clients))
        continue;

      foreach (var clientProp in clients.EnumerateObject())
      {
        var clientId = clientProp.Name;
        var clientAlias = clientProp.Value.GetString() ?? clientId;

        var (friendlyName, baseUrl) = knownClients.TryGetValue(clientAlias, out var known)
          ? known
          : (clientAlias, "");

        found[clientId] = new
        {
          name = friendlyName,
          clientId = clientId,
          url = baseUrl,
          type = "Internal", // Adjust if needed
          status = "In use",
        };
      }
    }

    return Ok(found.Values);
  }

  // Example mapping (hardcoded; you could load from config/db if needed)


  private async Task<string> GetAdminAccessToken()
  {
    var client = new HttpClient();
    var parameters = new Dictionary<string, string>
    {
      { "client_id", _kc.ClientId },
      { "client_secret", _kc.ClientSecret },
      { "grant_type", "client_credentials" },
    };

    var tokenUrl = $"{_kc.BaseUrl}/realms/{_kc.Realm}/protocol/openid-connect/token";
    var response = await client.PostAsync(tokenUrl, new FormUrlEncodedContent(parameters));
    var json = await response.Content.ReadAsStringAsync();
    var parsed = JsonDocument.Parse(json);

    if (
      parsed.RootElement.TryGetProperty("access_token", out var tokenProp)
      && tokenProp.GetString() is string token
      && !string.IsNullOrWhiteSpace(token)
    )
    {
      return token;
    }

    throw new Exception("Failed to retrieve access token from Keycloak.");
  }
}
