namespace Edb.FeatureAccount.DTOs;

public record ChangePasswordRequest(string Password, bool SignOutOthers);
