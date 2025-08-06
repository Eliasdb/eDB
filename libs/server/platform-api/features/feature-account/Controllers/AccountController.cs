// ─────────────────────────────────────────────────────────────────────────────
// Controllers/ProfileController.cs
// ─────────────────────────────────────────────────────────────────────────────
using Edb.FeatureAccount.DTOs;
using Edb.FeatureAccount.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Edb.FeatureAccount.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AccountController : ControllerBase
{
  private readonly IAccountService _accountService;
  private readonly ILogger<AccountController> _logger;

  public AccountController(IAccountService accountService, ILogger<AccountController> logger)
  {
    _accountService = accountService;
    _logger = logger;
  }

  [HttpGet("userinfo")]
  [Authorize]
  public async Task<IActionResult> GetUserInfo() =>
    Content(await _accountService.GetUserInfoAsync(), "application/json");

  [HttpPut("update")]
  [Authorize]
  public async Task<IActionResult> UpdateUser([FromBody] AccountUpdateRequest dto) =>
    Ok(await _accountService.UpdateUserInfoAsync(dto));

  [HttpGet("otp-devices")]
  [Authorize]
  public async Task<IActionResult> GetOtpDevices() =>
    Ok(await _accountService.GetOtpDevicesAsync());

  [HttpDelete("otp-devices/{credId}")]
  [Authorize]
  public async Task<IActionResult> DeleteOtpDevice(string credId) =>
    await _accountService.DeleteOtpDeviceAsync(credId) ? NoContent() : StatusCode(500);

  [HttpPost("change-password")]
  [Authorize]
  public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordRequest dto) =>
    Ok(await _accountService.ChangePasswordAsync(dto));

  [HttpGet("password-meta")]
  [Authorize]
  public async Task<IActionResult> GetPasswordMeta() =>
    Ok(await _accountService.GetPasswordMetaAsync());

  [HttpGet("sessions")]
  [Authorize]
  public async Task<IActionResult> GetSessions() =>
    Ok(await _accountService.GetUserSessionsAsync());

  [HttpDelete("sessions/{sessionId}")]
  [Authorize]
  public async Task<IActionResult> RevokeSession(string sessionId) =>
    await _accountService.RevokeSessionAsync(sessionId) ? NoContent() : StatusCode(500);

  [HttpGet("applications")]
  [Authorize]
  public async Task<IActionResult> GetApplications() =>
    Ok(await _accountService.GetApplicationsAsync());

  [HttpGet("custom-attributes")]
  [Authorize]
  public async Task<IActionResult> GetCustomAttributes() =>
    Ok(await _accountService.GetCustomAttributesAsync());

  [HttpPut("custom-attributes")]
  [Authorize]
  public async Task<IActionResult> UpdateCustomAttributes(
    [FromBody] Dictionary<string, string> attrs
  ) => Ok(await _accountService.UpdateCustomAttributesAsync(attrs));

  [HttpPut("user-profile-config")]
  public async Task<IActionResult> UpdateUserProfileConfig() =>
    Ok(await _accountService.UpdateUserProfileConfigAsync());
}
