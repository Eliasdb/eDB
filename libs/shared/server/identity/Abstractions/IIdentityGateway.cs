namespace EDb.Identity.Abstractions;

using System.Text.Json;

public interface IIdentityGateway
{
    Task<string> GetUserInfoRawAsync(string accessToken);

    Task<bool> UpdateUserAsync(string userId, UpdateUserCommand cmd);

    Task<IEnumerable<JsonElement>> GetOtpDevicesAsync(string userId);
    Task<bool> DeleteOtpDeviceAsync(string userId, string credentialId);

    Task<bool> ChangePasswordAsync(string userId, string password, bool signOutOthers);

    Task<long?> GetPasswordCreatedDateAsync(string userId);

    Task<IEnumerable<JsonElement>> GetUserSessionsAsync(string userId);
    Task<bool> RevokeSessionAsync(string sessionId);

    Task<IReadOnlyList<ApplicationInfo>> GetApplicationsAsync(string userId);

    Task<IDictionary<string, string>> GetCustomAttributesAsync(string userId);
    Task<bool> UpdateCustomAttributesAsync(string userId, IDictionary<string, string> attrs);

    Task<bool> UpdateUserProfileConfigAsync(UserProfileConfig config);

    Task<PagedResult<IdpUser>> GetUsersAsync(string? search, string? cursor, int pageSize);
}
