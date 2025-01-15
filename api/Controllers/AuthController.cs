using api.Data;
using api.DTOs.Admin;
using api.DTOs.Auth;
using api.Models;
using api.Services;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace api.Controllers
{
    [ApiController]
    [Route("api/auth")]
    public class AuthController(MyDbContext context, AuthService authService, IMapper mapper)
        : ControllerBase
    {
        private readonly MyDbContext _context = context;
        private readonly IMapper _mapper = mapper;
        private readonly AuthService _authService = authService;

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterRequest request)
        {
            if (await _context.Users.AnyAsync(u => u.Email == request.Email))
            {
                return BadRequest(
                    new { error = "ValidationError", message = "Email already exists!" }
                );
            }

            var (hashedPassword, salt) = _authService.HashPassword(request.Password);

            var user = _mapper.Map<User>(request);
            user.PasswordHash = hashedPassword;
            user.Salt = salt;
            user.Role = UserRole.User; // Default role

            await _context.Users.AddAsync(user);
            await _context.SaveChangesAsync();

            var userDto = _mapper.Map<UserDto>(user);

            return Ok(new { message = "Registration successful!", user = userDto });
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == request.Email);

            if (
                user == null
                || string.IsNullOrEmpty(user.Salt)
                || !_authService.VerifyPassword(request.Password, user.PasswordHash, user.Salt)
            )
            {
                return Unauthorized(
                    new { error = "InvalidCredentials", message = "Invalid email or password!" }
                );
            }

            var token = _authService.GenerateJwtToken(user);

            var userDto = _mapper.Map<UserDto>(user);

            return Ok(
                new
                {
                    message = "Login successful!",
                    token,
                    user = userDto,
                }
            );
        }
    }
}
