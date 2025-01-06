using Microsoft.AspNetCore.Mvc;
using api.Data;
using api.DTOs.Auth;
using api.Models;
using api.Services;
using Microsoft.EntityFrameworkCore;

namespace api.Controllers
{
    [ApiController]
    [Route("api/auth")]
    public class AuthController : ControllerBase
    {
        private readonly MyDbContext _context;
        private readonly AuthService _authService;

        public AuthController(MyDbContext context, AuthService authService)
        {
            _context = context;
            _authService = authService;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterRequest request)
        {
            if (await _context.Users.AnyAsync(u => u.Email == request.Email))
            {
                return BadRequest(new
                {
                    error = "ValidationError",
                    message = "Email already exists!"
                });
            }

            var (hashedPassword, salt) = _authService.HashPassword(request.Password);

            var user = new User
            {
                Email = request.Email,
                PasswordHash = hashedPassword,
                FirstName = request.FirstName,
                LastName = request.LastName,
                Country = request.Country,
                State = request.State,
                Company = request.Company,
                Salt = salt,
                Role = UserRole.User // Default role
            };

            await _context.Users.AddAsync(user);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = "Registration successful!",
                user = new
                {
                    user.Id,
                    user.Email,
                    user.FirstName,
                    user.LastName,
                    user.Country,
                    user.State,
                    user.Company,
                    user.Role
                }
            });
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == request.Email);

            if (user == null || string.IsNullOrEmpty(user.Salt) || !_authService.VerifyPassword(request.Password, user.PasswordHash, user.Salt))
            {
                return Unauthorized(new
                {
                    error = "InvalidCredentials",
                    message = "Invalid email or password!"
                });
            }

            var token = _authService.GenerateJwtToken(user);

            return Ok(new
            {
                message = "Login successful!",
                token,
                user = new
                {
                    user.Id,
                    user.Email,
                    user.FirstName,
                    user.LastName,
                    user.Role
                }
            });
        }
    }
}
