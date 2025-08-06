// ─────────────────────────────────────────────────────────────────────────────
// Repositories/IKeycloakRepository.cs
// ─────────────────────────────────────────────────────────────────────────────
using System.Text.Json;
using Edb.FeatureAccount.DTOs;

namespace Edb.FeatureAccount.Interfaces;

public interface IKeycloakRepository
{
    Task<string> GetUserInfoAsync(string accessToken);
    Task<bool> UpdateUserAsync(string userId, AccountUpdateRequest dto);
    Task<IEnumerable<JsonElement>> GetOtpDevicesAsync(string userId);
    Task<bool> DeleteOtpDeviceAsync(string userId, string credId);
    Task<bool> ChangePasswordAsync(string userId, string password, bool signOutOthers);
    Task<long?> GetPasswordCreatedDateAsync(string userId);
    Task<IEnumerable<JsonElement>> GetUserSessionsAsync(string userId);
    Task<bool> RevokeSessionAsync(string sessionId);
    Task<IEnumerable<ApplicationInfo>> GetApplicationsAsync(string userId);
    Task<Dictionary<string, string>> GetCustomAttributesAsync(string userId);
    Task<bool> UpdateCustomAttributesAsync(string userId, Dictionary<string, string> attrs);
    Task<bool> UpdateUserProfileConfigAsync();
}
