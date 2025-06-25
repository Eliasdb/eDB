// ─────────────────────────────────────────────────────────────────────────────
// Services/IProfileService.cs
// ─────────────────────────────────────────────────────────────────────────────
using System.Text.Json;
using Edb.FeatureAccount.DTOs;

namespace Edb.FeatureAccount.Interfaces;

public interface IAccountService
{
  Task<string> GetUserInfoAsync();
  Task<object> UpdateUserInfoAsync(AccountUpdateRequest dto);
  Task<IEnumerable<JsonElement>> GetOtpDevicesAsync();
  Task<bool> DeleteOtpDeviceAsync(string credId);
  Task<object> ChangePasswordAsync(ChangePasswordRequest dto);
  Task<object> GetPasswordMetaAsync();
  Task<IEnumerable<JsonElement>> GetUserSessionsAsync();
  Task<bool> RevokeSessionAsync(string sessionId);
  Task<IEnumerable<ApplicationInfo>> GetApplicationsAsync();
  Task<Dictionary<string, string>> GetCustomAttributesAsync();
  Task<object> UpdateCustomAttributesAsync(Dictionary<string, string> attrs);
  Task<object> UpdateUserProfileConfigAsync();
}
