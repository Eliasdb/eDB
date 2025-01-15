using api.DTOs.Auth;
using api.Services;
using Microsoft.AspNetCore.Mvc;

namespace api.Controllers
{
    [ApiController]
    [Route("api/auth")]
    public class AuthController(AuthService authService) : ControllerBase
    {
        private readonly AuthService _authService = authService;

        [HttpPost("register")]
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
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            var (success, message, token, userDto) = await _authService.LoginAsync(request);

            if (!success)
            {
                return Unauthorized(new { error = "InvalidCredentials", message });
            }

            return Ok(
                new
                {
                    message,
                    token,
                    user = userDto,
                }
            );
        }
    }
}
