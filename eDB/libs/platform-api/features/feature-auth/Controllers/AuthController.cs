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

    public class TokenRequest
    {
      public required string Code { get; set; }
    }

    [HttpPost("exchange-token")]
    [Consumes("application/x-www-form-urlencoded")] // ✅ Tell ASP.NET Core to accept this content type
    public async Task<IActionResult> ExchangeToken([FromForm] TokenRequest tokenRequest)
    {
      _logger.LogInformation("Received token exchange request. Code: {Code}", tokenRequest.Code);

      using var client = new HttpClient();
      var values = new Dictionary<string, string>
      {
        { "client_id", "edb-app" },
        { "client_secret", "q2TAcbE7PzfUZCebXoumCuZj0afRTfyb" }, // 🔥 Ensure this is safe
        { "grant_type", "authorization_code" },
        { "code", tokenRequest.Code },
        { "redirect_uri", "http://localhost:4200/callback" },
      };

      var content = new FormUrlEncodedContent(values);
      string requestUrl = "http://localhost:8080/realms/EDB/protocol/openid-connect/token";

      _logger.LogInformation(
        "Sending token exchange request to {Url} with payload: {Payload}",
        requestUrl,
        values
      );

      try
      {
        var response = await client.PostAsync(requestUrl, content);
        string responseBody = await response.Content.ReadAsStringAsync();

        if (!response.IsSuccessStatusCode)
        {
          _logger.LogError(
            "Token exchange failed. Status Code: {StatusCode}, Response: {ResponseBody}",
            response.StatusCode,
            responseBody
          );
          return BadRequest($"Failed to exchange token: {responseBody}");
        }

        _logger.LogInformation("Token exchange successful. Response: {ResponseBody}", responseBody);
        return Ok(responseBody);
      }
      catch (Exception ex)
      {
        _logger.LogError(ex, "Unexpected error during token exchange.");
        return StatusCode(500, "Internal server error.");
      }
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
