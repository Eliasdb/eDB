// ─────────────────────────────────────────────────────────────────────────────
// Services/AccountService.cs  (implements Edb.FeatureAccount.Interfaces.IAccountService)
// ─────────────────────────────────────────────────────────────────────────────
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text.Json;
using Edb.FeatureAccount.DTOs;
using Edb.FeatureAccount.Interfaces;
using EDb.Identity.Abstractions;
using Microsoft.AspNetCore.Http;
// Avoid the DTO/Abstractions name clash explicitly
using FeatureAppInfo = Edb.FeatureAccount.DTOs.ApplicationInfo;

namespace Edb.FeatureAccount.Services;

/// <summary>
/// Orchestrates account-related operations via the identity gateway,
/// using the current HTTP user's access token and subject id.
/// </summary>
public class AccountService(IIdentityGateway idp, IHttpContextAccessor ctx) : IAccountService
{
    private const string BearerPrefix = "Bearer ";
    private const string ClaimSub = "sub"; // with MapInboundClaims disabled, we keep OIDC names

    private readonly IIdentityGateway _idp = idp ?? throw new ArgumentNullException(nameof(idp));
    private readonly IHttpContextAccessor _ctx =
        ctx ?? throw new ArgumentNullException(nameof(ctx));

    /* ───────────────────────────────── helpers ───────────────────────────────── */

    private HttpContext Http =>
        _ctx.HttpContext ?? throw new InvalidOperationException("No active HttpContext.");

    private ClaimsPrincipal User =>
        Http.User ?? throw new InvalidOperationException("No authenticated user principal.");

    /// <summary>
    /// Extracts the raw access token from the Authorization header.
    /// </summary>
    private string EnsureAccessToken()
    {
        if (!Http.Request.Headers.TryGetValue("Authorization", out var authHeader))
            throw new UnauthorizedAccessException("Missing Authorization header.");

        var header = authHeader.ToString();
        if (
            string.IsNullOrWhiteSpace(header)
            || !header.StartsWith(BearerPrefix, StringComparison.OrdinalIgnoreCase)
        )
            throw new UnauthorizedAccessException("Invalid Authorization header.");

        var token = header.Substring(BearerPrefix.Length).Trim();
        if (string.IsNullOrWhiteSpace(token))
            throw new UnauthorizedAccessException("Missing bearer token.");

        return token;
    }

    /// <summary>
    /// Resolves the subject (user id) from claims or the JWT subject as a fallback.
    /// </summary>
    private string EnsureUserId()
    {
        // Primary: the "sub" claim
        var sub =
            User.FindFirst(ClaimSub)?.Value ?? User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        if (!string.IsNullOrWhiteSpace(sub))
            return sub!;

        // Fallback: parse JWT if available
        string token;
        try
        {
            token = EnsureAccessToken();
        }
        catch
        {
            throw new UnauthorizedAccessException("Cannot resolve user id from claims or token.");
        }

        var jwt = new JwtSecurityTokenHandler().ReadJwtToken(token);
        if (!string.IsNullOrWhiteSpace(jwt?.Subject))
            return jwt!.Subject!;

        throw new UnauthorizedAccessException("Cannot resolve user id.");
    }

    /* ───────────────────────────────── queries & commands ───────────────────────────────── */

    public Task<string> GetUserInfoAsync()
    {
        var token = EnsureAccessToken();
        return _idp.GetUserInfoRawAsync(token);
    }

    public async Task<object> UpdateUserInfoAsync(AccountUpdateRequest dto)
    {
        if (dto is null)
            throw new ArgumentNullException(nameof(dto));

        var userId = EnsureUserId();
        await _idp.UpdateUserAsync(
            userId,
            new UpdateUserCommand(dto.FirstName, dto.LastName, dto.Email)
        );

        return ApiMessage("User info updated successfully.");
    }

    public Task<IEnumerable<JsonElement>> GetOtpDevicesAsync()
    {
        var userId = EnsureUserId();
        return _idp.GetOtpDevicesAsync(userId);
    }

    public Task<bool> DeleteOtpDeviceAsync(string credId)
    {
        if (string.IsNullOrWhiteSpace(credId))
            throw new ArgumentException("Credential id is required.", nameof(credId));

        var userId = EnsureUserId();
        return _idp.DeleteOtpDeviceAsync(userId, credId);
    }

    public async Task<object> ChangePasswordAsync(ChangePasswordRequest dto)
    {
        if (dto is null)
            throw new ArgumentNullException(nameof(dto));

        var userId = EnsureUserId();
        await _idp.ChangePasswordAsync(userId, dto.Password, dto.SignOutOthers);

        return ApiMessage("Password updated successfully.");
    }

    public async Task<object> GetPasswordMetaAsync()
    {
        var userId = EnsureUserId();
        var created = await _idp.GetPasswordCreatedDateAsync(userId);
        return new { createdDate = created };
    }

    public Task<IEnumerable<JsonElement>> GetUserSessionsAsync()
    {
        var userId = EnsureUserId();
        return _idp.GetUserSessionsAsync(userId);
    }

    public Task<bool> RevokeSessionAsync(string sessionId)
    {
        if (string.IsNullOrWhiteSpace(sessionId))
            throw new ArgumentException("Session id is required.", nameof(sessionId));

        // Depending on IDP, revocation may not need userId; keep API as-is.
        return _idp.RevokeSessionAsync(sessionId);
    }

    public async Task<IEnumerable<FeatureAppInfo>> GetApplicationsAsync()
    {
        var userId = EnsureUserId();

        // Gateway returns EDb.Identity.Abstractions.ApplicationInfo
        var idpApps = await _idp.GetApplicationsAsync(userId);

        // Map to feature DTO
        return idpApps
            .Select(a => new FeatureAppInfo
            {
                ClientId = a.ClientId,
                Name = a.Name,
                Url = a.Url,
                Type = a.Type,
                Status = a.Status,
            })
            .ToArray();
    }

    public async Task<Dictionary<string, string>> GetCustomAttributesAsync()
    {
        var userId = EnsureUserId();
        var dict = await _idp.GetCustomAttributesAsync(userId);
        return new Dictionary<string, string>(dict); // defensive copy
    }

    public async Task<object> UpdateCustomAttributesAsync(Dictionary<string, string> attrs)
    {
        if (attrs is null)
            throw new ArgumentNullException(nameof(attrs));

        var userId = EnsureUserId();
        await _idp.UpdateCustomAttributesAsync(userId, attrs);

        return ApiMessage("Custom attributes updated successfully.");
    }

    public async Task<object> UpdateUserProfileConfigAsync()
    {
        var cfg = BuildDefaultUserProfileConfig();
        await _idp.UpdateUserProfileConfigAsync(cfg);
        return ApiMessage("User profile config updated successfully.");
    }

    /* ───────────────────────────────── internals ───────────────────────────────── */

    private static object ApiMessage(string message) => new { message };

    private static UserProfileConfig BuildDefaultUserProfileConfig() =>
        new UserProfileConfig(
            [
                // Use positional arguments to match your abstraction's ctor
                new UserProfileAttribute(
                    "jobTitle", // key
                    "Job Title", // displayName
                    ["user", "admin"], // readRoles
                    ["user", "admin"], // writeRoles
                    "text", // type
                    ["account", "admin"] // groups
                ),
                new UserProfileAttribute(
                    "preferredLanguage",
                    "Preferred Language",
                    ["user", "admin"],
                    ["user", "admin"],
                    "text",
                    ["account", "admin"]
                ),
            ]
        );
}
