// ─────────────────────────────────────────────────────────────────────────────
// Controllers/AccountController.cs
// ─────────────────────────────────────────────────────────────────────────────
using System.Net.Mime;
using Edb.FeatureAccount.DTOs;
using Edb.FeatureAccount.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Edb.FeatureAccount.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize] // apply to all endpoints unless explicitly overridden
[Produces(MediaTypeNames.Application.Json)]
public class AccountController : ControllerBase
{
    private readonly IAccountService _accountService;
    private readonly ILogger<AccountController> _logger;

    public AccountController(IAccountService accountService, ILogger<AccountController> logger)
    {
        _accountService = accountService;
        _logger = logger;
    }

    /// <summary>Returns the raw OIDC userinfo (JSON string from the IdP).</summary>
    [HttpGet("userinfo")]
    [ProducesResponseType(typeof(string), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetUserInfo()
    {
        var json = await _accountService.GetUserInfoAsync();
        // This endpoint intentionally proxies a raw JSON payload coming from the IdP.
        return Content(json, MediaTypeNames.Application.Json);
    }

    /// <summary>Updates basic profile fields for the current user.</summary>
    [HttpPut("update")]
    [Consumes(MediaTypeNames.Application.Json)]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<ActionResult<object>> UpdateUser([FromBody] AccountUpdateRequest dto)
    {
        if (!ModelState.IsValid)
            return ValidationProblem(ModelState);
        var result = await _accountService.UpdateUserInfoAsync(dto);
        return Ok(result);
    }

    /// <summary>Lists OTP/WebAuthn devices for the current user.</summary>
    [HttpGet("otp-devices")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<ActionResult<object>> GetOtpDevices()
    {
        var devices = await _accountService.GetOtpDevicesAsync();
        return Ok(devices);
    }

    /// <summary>Deletes a single OTP/WebAuthn credential by credential id.</summary>
    [HttpDelete("otp-devices/{credId}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> DeleteOtpDevice([FromRoute] string credId)
    {
        try
        {
            var ok = await _accountService.DeleteOtpDeviceAsync(credId);
            return ok ? NoContent() : NotFound();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to delete OTP device {@CredId}", credId);
            return StatusCode(
                StatusCodes.Status500InternalServerError,
                new { message = "Failed to delete OTP device." }
            );
        }
    }

    /// <summary>Changes the current user's password.</summary>
    [HttpPost("change-password")]
    [Consumes(MediaTypeNames.Application.Json)]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<ActionResult<object>> ChangePassword([FromBody] ChangePasswordRequest dto)
    {
        if (!ModelState.IsValid)
            return ValidationProblem(ModelState);
        var result = await _accountService.ChangePasswordAsync(dto);
        return Ok(result);
    }

    /// <summary>Returns password metadata (e.g., created date).</summary>
    [HttpGet("password-meta")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<ActionResult<object>> GetPasswordMeta()
    {
        var result = await _accountService.GetPasswordMetaAsync();
        return Ok(result);
    }

    /// <summary>Lists active sessions/devices for the current user.</summary>
    [HttpGet("sessions")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<ActionResult<object>> GetSessions()
    {
        var sessions = await _accountService.GetUserSessionsAsync();
        return Ok(sessions);
    }

    /// <summary>Revokes a specific session.</summary>
    [HttpDelete("sessions/{sessionId}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> RevokeSession([FromRoute] string sessionId)
    {
        var ok = await _accountService.RevokeSessionAsync(sessionId);
        return ok ? NoContent() : NotFound();
    }

    /// <summary>Returns the applications this user has access to.</summary>
    [HttpGet("applications")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<ActionResult<object>> GetApplications()
    {
        var apps = await _accountService.GetApplicationsAsync();
        return Ok(apps);
    }

    /// <summary>Returns custom user attributes (key/value).</summary>
    [HttpGet("custom-attributes")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<ActionResult<Dictionary<string, string>>> GetCustomAttributes()
    {
        var attrs = await _accountService.GetCustomAttributesAsync();
        return Ok(attrs);
    }

    /// <summary>Updates custom user attributes (key/value).</summary>
    [HttpPut("custom-attributes")]
    [Consumes(MediaTypeNames.Application.Json)]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<ActionResult<object>> UpdateCustomAttributes(
        [FromBody] Dictionary<string, string> attrs
    )
    {
        if (attrs is null)
            return BadRequest(new { message = "Attributes payload is required." });
        var result = await _accountService.UpdateCustomAttributesAsync(attrs);
        return Ok(result);
    }

    /// <summary>Updates the user profile configuration (IdP-side schema/settings).</summary>
    [HttpPut("user-profile-config")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<ActionResult<object>> UpdateUserProfileConfig()
    {
        var result = await _accountService.UpdateUserProfileConfigAsync();
        return Ok(result);
    }
}
