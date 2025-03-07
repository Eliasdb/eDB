using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using EDb.FeatureAuth.DTOs;
using EDb.FeatureAuth.Interfaces;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication.OpenIdConnect;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace EDb.FeatureAuth.Controllers
{
  public class AuthController(IAuthService authService, ILogger<AuthController> logger)
    : BaseApiController
  {
    private readonly IAuthService _authService = authService;
    private readonly ILogger<AuthController> _logger = logger;

    [HttpPost("register")]
    [AllowAnonymous] // ✅ Allows unauthenticated access
    public async Task<IActionResult> Register([FromBody] RegisterRequest request)
    {
      var (success, message, userDto) = await _authService.RegisterUserAsync(request);

      if (!success)
      {
        return BadRequest(new { error = "ValidationError", message });
      }

      return Ok(new { message, user = userDto });
    }

    [HttpGet("login")]
    [AllowAnonymous]
    public IActionResult Login()
    {
      return Challenge(
        new AuthenticationProperties { RedirectUri = "/" },
        OpenIdConnectDefaults.AuthenticationScheme
      );
    }

    [HttpGet("session")]
    public IActionResult CheckSession()
    {
      // ✅ Check if session exists
      if (!HttpContext.Session.TryGetValue("UserId", out _))
      {
        return Unauthorized(new { message = "Session expired" });
      }
      return Ok(new { message = "Session active" });
    }

    [HttpGet("role")]
    public IActionResult GetUserRole()
    {
      var userRole = HttpContext.Session.GetString("UserRole");
      if (string.IsNullOrEmpty(userRole))
      {
        return Unauthorized(new { message = "No active session" });
      }
      return Ok(new { role = userRole });
    }

    [HttpPost("logout")]
    public async Task<IActionResult> Logout()
    {
      // ✅ Clear session data from Redis
      HttpContext.Session.Clear();

      // ✅ Remove authentication cookie
      await HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
      await HttpContext.SignOutAsync(OpenIdConnectDefaults.AuthenticationScheme);
      return Ok(new { message = "Logged out successfully." });
    }
  }
}
