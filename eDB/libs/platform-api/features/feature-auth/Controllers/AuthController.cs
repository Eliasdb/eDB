using System.Security.Claims;
using EDb.FeatureAuth.DTOs;
using EDb.FeatureAuth.Interfaces;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace EDb.FeatureAuth.Controllers
{
  public class AuthController(IAuthService authService) : BaseApiController
  {
    private readonly IAuthService _authService = authService;

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

    [HttpPost("login")]
    [AllowAnonymous] // ✅ Allows unauthenticated access
    public async Task<IActionResult> Login([FromBody] LoginRequest request)
    {
      Console.WriteLine($"Login attempt for: {request.Email}");

      var (success, message, userDto) = await _authService.LoginAsync(request);

      if (!success)
      {
        Console.WriteLine("Login failed: " + message);
        return Unauthorized(new { error = "InvalidCredentials", message });
      }

      Console.WriteLine($"Login successful for: {userDto!.Email}");

      // ✅ Store session data in Redis
      HttpContext.Session.SetString("UserId", userDto.Id.ToString());
      HttpContext.Session.SetString("UserEmail", userDto.Email);
      HttpContext.Session.SetString("UserRole", userDto.Role);

      // ✅ Set Authentication Cookie
      var claims = new List<Claim>
      {
        new Claim(ClaimTypes.NameIdentifier, userDto.Id.ToString()),
        new Claim(ClaimTypes.Email, userDto.Email),
        new Claim(ClaimTypes.Role, userDto.Role),
      };

      var claimsIdentity = new ClaimsIdentity(claims, "Session");
      var claimsPrincipal = new ClaimsPrincipal(claimsIdentity);

      await HttpContext.SignInAsync(claimsPrincipal); // ✅ Ensures authentication persists

      Console.WriteLine("Session and authentication established!");

      return Ok(new { message, user = userDto });
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
      await HttpContext.SignOutAsync();

      return Ok(new { message = "Logged out successfully." });
    }
  }
}
