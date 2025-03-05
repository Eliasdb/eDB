using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using EDb.FeatureAuth.DTOs;
using EDb.FeatureAuth.Interfaces;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;

namespace EDb.FeatureAuth.Controllers
{
  public class AuthController : BaseApiController
  {
    private readonly IAuthService _authService;
    private readonly IConfiguration _config;

    public AuthController(IAuthService authService, IConfiguration config)
    {
      _authService = authService;
      _config = config;
    }

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

      // Store session data in Redis
      HttpContext.Session.SetString("UserId", userDto.Id.ToString());
      HttpContext.Session.SetString("UserEmail", userDto.Email);
      HttpContext.Session.SetString("UserRole", userDto.Role);

      // ✅ Set Authentication Cookie
      var claims = new List<Claim>
      {
        new Claim(ClaimTypes.NameIdentifier, userDto.Id.ToString()),
        new Claim(ClaimTypes.Email, userDto.Email),
        new Claim(ClaimTypes.Role, userDto.Role),
        new Claim(JwtRegisteredClaimNames.Sub, userDto.Id.ToString()),
        // 'email' claim for the user's email address
        new Claim(JwtRegisteredClaimNames.Email, userDto.Email),
        // 'jti' claim for a unique token identifier
        new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
      };

      var claimsIdentity = new ClaimsIdentity(claims, "Session");
      var claimsPrincipal = new ClaimsPrincipal(claimsIdentity);

      await HttpContext.SignInAsync(claimsPrincipal); // ✅ Ensures authentication persists

      // Generate the JWT token
      var jwtKey = _config["Jwt:Key"];
      var issuer = _config["Jwt:Issuer"];
      var audience = _config["Jwt:Audience"];
      if (string.IsNullOrEmpty(jwtKey))
      {
        throw new InvalidOperationException("JWT Key is not configured.");
      }
      var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey));
      var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
      var token = new JwtSecurityToken(
        issuer: issuer,
        audience: audience,
        claims: claims,
        expires: DateTime.UtcNow.AddMinutes(30),
        signingCredentials: creds
      );
      var tokenString = new JwtSecurityTokenHandler().WriteToken(token);
      Console.WriteLine("JWT token generated.");

      // Set the JWT token in an HTTP-only cookie
      HttpContext.Response.Cookies.Append(
        "jwt",
        tokenString,
        new CookieOptions
        {
          HttpOnly = true, // Prevent JavaScript access
          Secure = false, // Require HTTPS in production
          SameSite = SameSiteMode.Lax, // Adjust as needed
          Expires = DateTime.UtcNow.AddMinutes(30),
        }
      );

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

      // Delete the JWT cookie
      HttpContext.Response.Cookies.Delete("jwt");

      return Ok(new { message = "Logged out successfully." });
    }
  }
}
