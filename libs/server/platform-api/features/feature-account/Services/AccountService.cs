// ─────────────────────────────────────────────────────────────────────────────
// Services/ProfileService.cs
// ─────────────────────────────────────────────────────────────────────────────
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text.Json;
using Edb.FeatureAccount.Config;
using Edb.FeatureAccount.DTOs;
using Edb.FeatureAccount.Interfaces;
using Microsoft.Extensions.Options;

namespace Edb.FeatureAccount.Services;

public class AccountService : IAccountService
{
    private readonly IKeycloakRepository _repo;
    private readonly IHttpContextAccessor _ctx;
    private readonly KeycloakSettings _kc;

    public AccountService(
        IKeycloakRepository repo,
        IHttpContextAccessor ctx,
        IOptions<KeycloakSettings> kc
    )
    {
        _repo = repo;
        _ctx = ctx;
        _kc = kc.Value;
    }

    private string? AccessToken =>
        _ctx.HttpContext?.Request.Headers.Authorization.FirstOrDefault()?.Split(' ').Last();

    private string? UserId
    {
        get
        {
            var jwt = AccessToken is null
                ? null
                : new JwtSecurityTokenHandler().ReadJwtToken(AccessToken);
            return jwt?.Subject
                ?? _ctx.HttpContext?.User.FindFirst("sub")?.Value
                ?? _ctx.HttpContext?.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        }
    }

    public async Task<string> GetUserInfoAsync()
    {
        if (string.IsNullOrWhiteSpace(AccessToken))
            throw new UnauthorizedAccessException("Missing access token");
        return await _repo.GetUserInfoAsync(AccessToken!);
    }

    public async Task<object> UpdateUserInfoAsync(AccountUpdateRequest dto)
    {
        if (UserId is null)
            throw new UnauthorizedAccessException();
        await _repo.UpdateUserAsync(UserId!, dto);
        return new { message = "User info updated successfully" };
    }

    public async Task<IEnumerable<JsonElement>> GetOtpDevicesAsync()
    {
        if (UserId is null)
            throw new UnauthorizedAccessException();
        return await _repo.GetOtpDevicesAsync(UserId!);
    }

    public async Task<bool> DeleteOtpDeviceAsync(string credId)
    {
        if (UserId is null)
            throw new UnauthorizedAccessException();
        return await _repo.DeleteOtpDeviceAsync(UserId!, credId);
    }

    public async Task<object> ChangePasswordAsync(ChangePasswordRequest dto)
    {
        if (UserId is null)
            throw new UnauthorizedAccessException();
        await _repo.ChangePasswordAsync(UserId!, dto.Password, dto.SignOutOthers);
        return new { message = "Password updated successfully" };
    }

    public async Task<object> GetPasswordMetaAsync()
    {
        if (UserId is null)
            throw new UnauthorizedAccessException();
        var created = await _repo.GetPasswordCreatedDateAsync(UserId!);
        return new { createdDate = created };
    }

    public async Task<IEnumerable<JsonElement>> GetUserSessionsAsync()
    {
        if (UserId is null)
            throw new UnauthorizedAccessException();
        return await _repo.GetUserSessionsAsync(UserId!);
    }

    public async Task<bool> RevokeSessionAsync(string sessionId) =>
        await _repo.RevokeSessionAsync(sessionId);

    public async Task<IEnumerable<ApplicationInfo>> GetApplicationsAsync()
    {
        if (UserId is null)
            throw new UnauthorizedAccessException();
        return await _repo.GetApplicationsAsync(UserId!);
    }

    public async Task<Dictionary<string, string>> GetCustomAttributesAsync()
    {
        if (UserId is null)
            throw new UnauthorizedAccessException();
        return await _repo.GetCustomAttributesAsync(UserId!);
    }

    public async Task<object> UpdateCustomAttributesAsync(Dictionary<string, string> attrs)
    {
        if (UserId is null)
            throw new UnauthorizedAccessException();
        await _repo.UpdateCustomAttributesAsync(UserId!, attrs);
        return new { message = "Custom attributes updated successfully." };
    }

    public async Task<object> UpdateUserProfileConfigAsync()
    {
        await _repo.UpdateUserProfileConfigAsync();
        return new { message = "User profile config updated successfully." };
    }
}
