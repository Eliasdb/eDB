namespace Edb.PlatformAPI.DTOs.Profile;

public record ChangePasswordRequest(string Password, bool SignOutOthers);
