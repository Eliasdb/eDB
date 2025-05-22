using System.IdentityModel.Tokens.Jwt;
using System.Net.Http.Headers;
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
