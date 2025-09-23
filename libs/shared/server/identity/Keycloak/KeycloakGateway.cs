namespace EDb.Identity.Keycloak;

using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using EDb.Identity.Abstractions;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

public sealed class KeycloakGateway : IIdentityGateway
{
    private readonly IHttpClientFactory _httpFactory;
    private readonly KeycloakSettings _kc;
    private readonly ILogger<KeycloakGateway> _logger;

    public KeycloakGateway(
        IHttpClientFactory httpFactory,
        IOptions<KeycloakSettings> kc,
        ILogger<KeycloakGateway> logger
    )
    {
        _httpFactory = httpFactory;
        _kc = kc.Value;
        _logger = logger;
    }

    public async Task<string> GetUserInfoRawAsync(string accessToken)
    {
        using var client = _httpFactory.CreateClient();
        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue(
            "Bearer",
            accessToken
        );
        client.DefaultRequestHeaders.Accept.Add(
            new MediaTypeWithQualityHeaderValue("application/json")
        );
        var url = $"{_kc.BaseUrl}/realms/{_kc.Realm}/protocol/openid-connect/userinfo";
        var res = await client.GetAsync(url);
        res.EnsureSuccessStatusCode();
        return await res.Content.ReadAsStringAsync();
    }

    public async Task<bool> UpdateUserAsync(string userId, UpdateUserCommand cmd)
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
                firstName = cmd.FirstName,
                lastName = cmd.LastName,
                email = cmd.Email,
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
        var token = await GetAdminTokenAsync();
        using var client = _httpFactory.CreateClient();
        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

        var url = $"{_kc.BaseUrl}/admin/realms/{_kc.Realm}/users/{userId}/credentials";
        var json = await client.GetStringAsync(url);
        var allCreds = JsonSerializer.Deserialize<List<JsonElement>>(json)!;
        return allCreds.Where(c => c.GetProperty("type").GetString() == "otp");
    }

    public async Task<bool> DeleteOtpDeviceAsync(string userId, string credId)
    {
        var token = await GetAdminTokenAsync();
        using var client = _httpFactory.CreateClient();
        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);
        var res = await client.DeleteAsync(
            $"{_kc.BaseUrl}/admin/realms/{_kc.Realm}/users/{userId}/credentials/{credId}"
        );
        return res.IsSuccessStatusCode;
    }

    public async Task<bool> ChangePasswordAsync(string userId, string password, bool signOutOthers)
    {
        var token = await GetAdminTokenAsync();
        using var client = _httpFactory.CreateClient();
        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);
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
        var token = await GetAdminTokenAsync();
        using var client = _httpFactory.CreateClient();
        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);
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
        var token = await GetAdminTokenAsync();
        using var client = _httpFactory.CreateClient();
        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);
        var json = await client.GetStringAsync(
            $"{_kc.BaseUrl}/admin/realms/{_kc.Realm}/users/{userId}/sessions"
        );
        return JsonSerializer.Deserialize<List<JsonElement>>(json)!;
    }

    public async Task<bool> RevokeSessionAsync(string sessionId)
    {
        var token = await GetAdminTokenAsync();
        using var client = _httpFactory.CreateClient();
        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);
        var res = await client.DeleteAsync(
            $"{_kc.BaseUrl}/admin/realms/{_kc.Realm}/sessions/{sessionId}"
        );
        return res.IsSuccessStatusCode;
    }

    public async Task<IReadOnlyList<ApplicationInfo>> GetApplicationsAsync(string userId)
    {
        var sessions = await GetUserSessionsAsync(userId);
        var known = new Dictionary<string, (string name, string url)>
        {
            ["edb-app"] = ("eDB App", "http://localhost:4200"),
            ["account-console"] = ("Account Console", $"{_kc.BaseUrl}/realms/{_kc.Realm}/account/"),
        };

        var apps = new Dictionary<string, ApplicationInfo>();
        foreach (var s in sessions)
        {
            if (!s.TryGetProperty("clients", out var clients))
                continue;
            foreach (var clientProp in clients.EnumerateObject())
            {
                var clientId = clientProp.Name;
                var alias = clientProp.Value.GetString() ?? clientId;
                var (friendly, url) = known.TryGetValue(alias, out var k) ? k : (alias, "");
                apps[clientId] = new ApplicationInfo(clientId, friendly, url, "Internal", "In use");
            }
        }
        return apps.Values.ToList();
    }

    public async Task<IDictionary<string, string>> GetCustomAttributesAsync(string userId)
    {
        var token = await GetAdminTokenAsync();
        using var client = _httpFactory.CreateClient();
        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);
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
                    result[prop.Name] = val!;
            }
        }
        return result;
    }

    public async Task<bool> UpdateCustomAttributesAsync(
        string userId,
        IDictionary<string, string> attrs
    )
    {
        var token = await GetAdminTokenAsync();
        using var client = _httpFactory.CreateClient();
        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);
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

    public async Task<bool> UpdateUserProfileConfigAsync(UserProfileConfig config)
    {
        var token = await GetAdminTokenAsync();
        using var client = _httpFactory.CreateClient();
        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);
        client.DefaultRequestHeaders.Accept.Add(
            new MediaTypeWithQualityHeaderValue("application/json")
        );

        var payload = new
        {
            attributes = config.Attributes.Select(a => new
            {
                name = a.Name,
                displayName = a.DisplayName,
                permissions = new { view = a.ViewRoles, edit = a.EditRoles },
                annotations = new { inputType = a.InputType },
                displayAnnotations = new { form = a.VisibleInForms },
            }),
        };

        var res = await client.PutAsync(
            $"{_kc.BaseUrl}/admin/realms/{_kc.Realm}/user-profile",
            new StringContent(JsonSerializer.Serialize(payload), Encoding.UTF8, "application/json")
        );
        return res.IsSuccessStatusCode;
    }

    // ── helpers
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
        res.EnsureSuccessStatusCode();
        var json = await res.Content.ReadAsStringAsync();
        var doc = JsonDocument.Parse(json);
        return doc.RootElement.GetProperty("access_token").GetString()!;
    }

    public async Task<PagedResult<IdpUser>> GetUsersAsync(
        string? search,
        string? cursor,
        int pageSize
    )
    {
        // Keycloak uses offset pagination: first/max
        int first = 0;
        _ = int.TryParse(cursor, out first); // if cursor is null/invalid -> 0

        var adminToken = await GetAdminTokenAsync();
        using var client = _httpFactory.CreateClient();
        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue(
            "Bearer",
            adminToken
        );
        client.DefaultRequestHeaders.Accept.Add(
            new MediaTypeWithQualityHeaderValue("application/json")
        );

        var url = new StringBuilder(
            $"{_kc.BaseUrl}/admin/realms/{_kc.Realm}/users?first={first}&max={pageSize}"
        );
        if (!string.IsNullOrWhiteSpace(search))
        {
            url.Append("&search=").Append(Uri.EscapeDataString(search));
        }

        var json = await client.GetStringAsync(url.ToString());

        // Minimal DTO to match Keycloak payload
        var opts = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };
        var items = JsonSerializer.Deserialize<List<KeycloakUserDto>>(json, opts) ?? new();

        var list = items
            .Select(u => new IdpUser(
                Id: u.Id ?? "",
                Username: u.Username,
                Email: u.Email,
                FirstName: u.FirstName,
                LastName: u.LastName,
                EmailVerified: u.EmailVerified
            ))
            .ToList();

        // Heuristic: if we got 'pageSize' items, assume there might be more
        var hasMore = list.Count == pageSize;
        var nextCursor = hasMore ? (first + pageSize).ToString() : null;

        return new PagedResult<IdpUser>(list, nextCursor, hasMore);
    }

    private sealed class KeycloakUserDto
    {
        public string? Id { get; set; }
        public string? Username { get; set; }
        public string? Email { get; set; }
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public bool EmailVerified { get; set; }
    }
}
