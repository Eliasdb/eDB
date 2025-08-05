// ─────────────────────────────────────────────────────────────────────────────
// Repositories/KeycloakRepository.cs
// ─────────────────────────────────────────────────────────────────────────────
using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using Edb.FeatureAccount.Config;
using Edb.FeatureAccount.DTOs;
using Edb.FeatureAccount.Interfaces;
using Microsoft.Extensions.Options;

namespace Edb.FeatureAccount.Repositories;

public class KeycloakRepository : IKeycloakRepository
{
    private readonly IHttpClientFactory _httpFactory;
    private readonly KeycloakSettings _kc;
    private readonly ILogger<KeycloakRepository> _logger;

    public KeycloakRepository(
        IHttpClientFactory httpFactory,
        IOptions<KeycloakSettings> kc,
        ILogger<KeycloakRepository> logger
    )
    {
        _httpFactory = httpFactory;
        _kc = kc.Value;
        _logger = logger;
    }

    public async Task<string> GetUserInfoAsync(string accessToken)
    {
        using var client = _httpFactory.CreateClient();
        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue(
            "Bearer",
            accessToken
        );
        client.DefaultRequestHeaders.Accept.Add(
            new MediaTypeWithQualityHeaderValue("application/json")
        );
        _logger.LogWarning("BaseUrl: {BaseUrl}, Realm: {Realm}", _kc.BaseUrl, _kc.Realm);

        var url = $"{_kc.BaseUrl}/realms/{_kc.Realm}/protocol/openid-connect/userinfo";
        var res = await client.GetAsync(url);
        res.EnsureSuccessStatusCode();
        return await res.Content.ReadAsStringAsync();
    }

    public async Task<bool> UpdateUserAsync(string userId, AccountUpdateRequest dto)
    {
        var adminToken = await GetAdminTokenAsync();
        using var client = _httpFactory.CreateClient();
        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue(
            "Bearer",
            adminToken
        );
        client.DefaultRequestHeaders.Accept.Add(
            new MediaTypeWithQualityHeaderValue("application/json")
        );

        var body = JsonSerializer.Serialize(
            new
            {
                firstName = dto.FirstName,
                lastName = dto.LastName,
                email = dto.Email,
            }
        );

        var res = await client.PutAsync(
            $"{_kc.BaseUrl}/admin/realms/{_kc.Realm}/users/{userId}",
            new StringContent(body, Encoding.UTF8, "application/json")
        );
        return res.IsSuccessStatusCode;
    }

    public async Task<IEnumerable<JsonElement>> GetOtpDevicesAsync(string userId)
    {
        var adminToken = await GetAdminTokenAsync();
        using var client = _httpFactory.CreateClient();
        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue(
            "Bearer",
            adminToken
        );

        var url = $"{_kc.BaseUrl}/admin/realms/{_kc.Realm}/users/{userId}/credentials";
        var json = await client.GetStringAsync(url);
        var allCreds = JsonSerializer.Deserialize<List<JsonElement>>(json)!;
        return allCreds.Where(c => c.GetProperty("type").GetString() == "otp");
    }

    public async Task<bool> DeleteOtpDeviceAsync(string userId, string credId)
    {
        var adminToken = await GetAdminTokenAsync();
        using var client = _httpFactory.CreateClient();
        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue(
            "Bearer",
            adminToken
        );
        var res = await client.DeleteAsync(
            $"{_kc.BaseUrl}/admin/realms/{_kc.Realm}/users/{userId}/credentials/{credId}"
        );
        return res.IsSuccessStatusCode;
    }

    public async Task<bool> ChangePasswordAsync(string userId, string password, bool signOutOthers)
    {
        var adminToken = await GetAdminTokenAsync();
        using var client = _httpFactory.CreateClient();
        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue(
            "Bearer",
            adminToken
        );
        client.DefaultRequestHeaders.Accept.Add(
            new MediaTypeWithQualityHeaderValue("application/json")
        );

        var body = JsonSerializer.Serialize(
            new
            {
                type = "password",
                value = password,
                temporary = false,
            }
        );
        var res = await client.PutAsync(
            $"{_kc.BaseUrl}/admin/realms/{_kc.Realm}/users/{userId}/reset-password",
            new StringContent(body, Encoding.UTF8, "application/json")
        );
        if (!res.IsSuccessStatusCode)
            return false;

        if (signOutOthers)
            await client.PostAsync(
                $"{_kc.BaseUrl}/admin/realms/{_kc.Realm}/users/{userId}/logout",
                null
            );
        return true;
    }

    public async Task<long?> GetPasswordCreatedDateAsync(string userId)
    {
        var adminToken = await GetAdminTokenAsync();
        using var client = _httpFactory.CreateClient();
        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue(
            "Bearer",
            adminToken
        );
        var json = await client.GetStringAsync(
            $"{_kc.BaseUrl}/admin/realms/{_kc.Realm}/users/{userId}/credentials"
        );
        var creds = JsonSerializer.Deserialize<List<JsonElement>>(json)!;
        var pwd = creds.FirstOrDefault(c => c.GetProperty("type").GetString() == "password");
        return pwd.ValueKind == JsonValueKind.Undefined
            ? null
            : pwd.GetProperty("createdDate").GetInt64();
    }

    public async Task<IEnumerable<JsonElement>> GetUserSessionsAsync(string userId)
    {
        var adminToken = await GetAdminTokenAsync();
        using var client = _httpFactory.CreateClient();
        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue(
            "Bearer",
            adminToken
        );
        var json = await client.GetStringAsync(
            $"{_kc.BaseUrl}/admin/realms/{_kc.Realm}/users/{userId}/sessions"
        );
        return JsonSerializer.Deserialize<List<JsonElement>>(json)!;
    }

    public async Task<bool> RevokeSessionAsync(string sessionId)
    {
        var adminToken = await GetAdminTokenAsync();
        using var client = _httpFactory.CreateClient();
        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue(
            "Bearer",
            adminToken
        );
        var res = await client.DeleteAsync(
            $"{_kc.BaseUrl}/admin/realms/{_kc.Realm}/sessions/{sessionId}"
        );
        return res.IsSuccessStatusCode;
    }

    public async Task<IEnumerable<ApplicationInfo>> GetApplicationsAsync(string userId)
    {
        var sessions = await GetUserSessionsAsync(userId);
        var known = new Dictionary<string, (string name, string url)>
        {
            ["edb-app"] = ("eDB App", "http://localhost:4200"),
            ["account-console"] = ("Account Console", $"{_kc.BaseUrl}/realms/{_kc.Realm}/account/"),
        };

        var apps = new Dictionary<string, ApplicationInfo>();
        foreach (var session in sessions)
        {
            if (!session.TryGetProperty("clients", out var clients))
                continue;
            foreach (var clientProp in clients.EnumerateObject())
            {
                var clientId = clientProp.Name;
                var alias = clientProp.Value.GetString() ?? clientId;
                var (friendly, url) = known.TryGetValue(alias, out var k) ? k : (alias, "");
                apps[clientId] = new ApplicationInfo
                {
                    ClientId = clientId,
                    Name = friendly,
                    Url = url,
                    Type = "Internal",
                    Status = "In use",
                };
            }
        }
        return apps.Values;
    }

    public async Task<Dictionary<string, string>> GetCustomAttributesAsync(string userId)
    {
        var adminToken = await GetAdminTokenAsync();
        using var client = _httpFactory.CreateClient();
        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue(
            "Bearer",
            adminToken
        );
        client.DefaultRequestHeaders.Accept.Add(
            new MediaTypeWithQualityHeaderValue("application/json")
        );

        var json = await client.GetStringAsync(
            $"{_kc.BaseUrl}/admin/realms/{_kc.Realm}/users/{userId}"
        );
        using var doc = JsonDocument.Parse(json);
        var result = new Dictionary<string, string>();
        if (
            doc.RootElement.TryGetProperty("attributes", out var attrs)
            && attrs.ValueKind == JsonValueKind.Object
        )
        {
            foreach (var prop in attrs.EnumerateObject())
            {
                var val =
                    prop.Value.ValueKind == JsonValueKind.Array && prop.Value.GetArrayLength() > 0
                        ? prop.Value[0].GetString()
                        : prop.Value.GetString();
                if (val is not null)
                    result[prop.Name] = val;
            }
        }
        return result;
    }

    public async Task<bool> UpdateCustomAttributesAsync(
        string userId,
        Dictionary<string, string> attrs
    )
    {
        var adminToken = await GetAdminTokenAsync();
        using var client = _httpFactory.CreateClient();
        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue(
            "Bearer",
            adminToken
        );
        client.DefaultRequestHeaders.Accept.Add(
            new MediaTypeWithQualityHeaderValue("application/json")
        );

        var existing = await client.GetStringAsync(
            $"{_kc.BaseUrl}/admin/realms/{_kc.Realm}/users/{userId}"
        );
        using var doc = JsonDocument.Parse(existing);
        var root = doc.RootElement;

        var payload = new Dictionary<string, object?>
        {
            ["id"] = userId,
            ["username"] = root.GetProperty("username").GetString(),
            ["firstName"] = root.GetProperty("firstName").GetString(),
            ["lastName"] = root.GetProperty("lastName").GetString(),
            ["email"] = root.GetProperty("email").GetString(),
            ["enabled"] = root.GetProperty("enabled").GetBoolean(),
            ["attributes"] = attrs.ToDictionary(kvp => kvp.Key, kvp => new[] { kvp.Value }),
        };

        var res = await client.PutAsync(
            $"{_kc.BaseUrl}/admin/realms/{_kc.Realm}/users/{userId}",
            new StringContent(JsonSerializer.Serialize(payload), Encoding.UTF8, "application/json")
        );
        return res.IsSuccessStatusCode;
    }

    public async Task<bool> UpdateUserProfileConfigAsync()
    {
        var adminToken = await GetAdminTokenAsync();
        using var client = _httpFactory.CreateClient();
        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue(
            "Bearer",
            adminToken
        );
        client.DefaultRequestHeaders.Accept.Add(
            new MediaTypeWithQualityHeaderValue("application/json")
        );

        var payload = new
        {
            attributes = new[]
            {
                new
                {
                    name = "jobTitle",
                    displayName = "Job Title",
                    permissions = new
                    {
                        view = new[] { "user", "admin" },
                        edit = new[] { "user", "admin" },
                    },
                    annotations = new { inputType = "text" },
                    displayAnnotations = new { form = new[] { "account", "admin" } },
                },
                new
                {
                    name = "preferredLanguage",
                    displayName = "Preferred Language",
                    permissions = new
                    {
                        view = new[] { "user", "admin" },
                        edit = new[] { "user", "admin" },
                    },
                    annotations = new { inputType = "text" },
                    displayAnnotations = new { form = new[] { "account", "admin" } },
                },
            },
        };

        var res = await client.PutAsync(
            $"{_kc.BaseUrl}/admin/realms/{_kc.Realm}/user-profile",
            new StringContent(JsonSerializer.Serialize(payload), Encoding.UTF8, "application/json")
        );
        return res.IsSuccessStatusCode;
    }

    // ────────────────────────────────────────────────────────────────────────
    // Private helpers
    // ────────────────────────────────────────────────────────────────────────
    private async Task<string> GetAdminTokenAsync()
    {
        using var client = _httpFactory.CreateClient();
        var res = await client.PostAsync(
            $"{_kc.BaseUrl}/realms/{_kc.Realm}/protocol/openid-connect/token",
            new FormUrlEncodedContent(
                new Dictionary<string, string>
                {
                    ["client_id"] = _kc.ClientId,
                    ["client_secret"] = _kc.ClientSecret,
                    ["grant_type"] = "client_credentials",
                }
            )
        );
        var json = await res.Content.ReadAsStringAsync();
        var doc = JsonDocument.Parse(json);
        return doc.RootElement.GetProperty("access_token").GetString()!;
    }
}
