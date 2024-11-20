using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using api.Data;
using api.DTOs;
using api.Models;

namespace api.Controllers
{
    [ApiController]
    [Route("api/auth")]
    public class AuthController : ControllerBase
    {
        private readonly MyDbContext _context;
        private readonly IConfiguration _configuration;

        public AuthController(MyDbContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        [HttpGet("admin-area")]
        [RoleAuthorize("Admin")]
        public IActionResult AdminArea()
        {
            return Ok("Welcome, Admin!");
        }

        [HttpPost("register")]
        public IActionResult Register([FromBody] RegisterRequest request)
        {
            if (_context.Users.Any(u => u.Email == request.Email))
            {
                return BadRequest(new
                {
                    error = "ValidationError",
                    message = "Email already exists"
                });
            }

            var (hashedPassword, salt) = HashPassword(request.Password);

            var user = new User
            {
                Email = request.Email,
                PasswordHash = hashedPassword,
                FirstName = request.FirstName,
                LastName = request.LastName,
                Country = request.Country,
                State = request.State,
                Company = request.Company,
                DisplayName = null,
                PreferredLanguage = null,
                Title = null,
                Address = null,
                Salt = salt,
                Role = UserRole.User // Default to "User"
            };

            _context.Users.Add(user);
            _context.SaveChanges();

            return Ok(new
            {
                message = "Registration successful",
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
public IActionResult Login([FromBody] LoginRequest request)
{
    // Find the user by email
    var user = _context.Users.FirstOrDefault(u => u.Email == request.Email);

    // Check if the user exists and has a valid salt
    if (user == null || string.IsNullOrEmpty(user.Salt) || 
        !VerifyPassword(request.Password, user.PasswordHash, user.Salt))
    {
        return Unauthorized(new
        {
            error = "InvalidCredentials",
            message = "Invalid email or password"
        });
    }

    // Generate a JWT token for the user
    var token = GenerateJwtToken(user);

    // Return success response
    return Ok(new
    {
        message = "Login successful",
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


        [HttpPut("profile")]
        public IActionResult UpdateProfile([FromBody] ProfileUpdateRequest request)
        {
            var userIdClaim = HttpContext.User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null)
            {
                return Unauthorized(new
                {
                    error = "Unauthorized",
                    message = "User not authenticated"
                });
            }

            int userId = int.Parse(userIdClaim.Value);
            var user = _context.Users.FirstOrDefault(u => u.Id == userId);
            if (user == null)
            {
                return NotFound(new
                {
                    error = "NotFound",
                    message = "User not found"
                });
            }

            if (!string.IsNullOrEmpty(request.Password))
            {
                var (hashedPassword, salt) = HashPassword(request.Password);
                user.PasswordHash = hashedPassword;
                user.Salt = salt;
            }

            if (!string.IsNullOrEmpty(request.FirstName))
                user.FirstName = request.FirstName;

            if (!string.IsNullOrEmpty(request.LastName))
                user.LastName = request.LastName;

            if (!string.IsNullOrEmpty(request.Country))
                user.Country = request.Country;

            if (!string.IsNullOrEmpty(request.State))
                user.State = request.State;

            if (!string.IsNullOrEmpty(request.Company))
                user.Company = request.Company;

            if (!string.IsNullOrEmpty(request.DisplayName))
                user.DisplayName = request.DisplayName;

            if (!string.IsNullOrEmpty(request.PreferredLanguage))
                user.PreferredLanguage = request.PreferredLanguage;

            if (!string.IsNullOrEmpty(request.Title))
                user.Title = request.Title;

            if (!string.IsNullOrEmpty(request.Address))
                user.Address = request.Address;

            _context.SaveChanges();

            return Ok(new
            {
                message = "Profile updated successfully",
                user = new
                {
                    user.Email,
                    user.FirstName,
                    user.LastName,
                    user.Country,
                    user.State,
                    user.Company,
                    user.DisplayName,
                    user.PreferredLanguage,
                    user.Title,
                    user.Address
                }
            });
        }

        private (string Hash, string Salt) HashPassword(string password)
        {
            byte[] saltBytes = RandomNumberGenerator.GetBytes(16);
            string salt = Convert.ToBase64String(saltBytes);

            string saltedPassword = salt + password;
            byte[] hashBytes = SHA256.HashData(Encoding.UTF8.GetBytes(saltedPassword));
            string hash = Convert.ToBase64String(hashBytes);

            return (hash, salt);
        }

        private bool VerifyPassword(string password, string storedHash, string storedSalt)
        {
            string saltedPassword = storedSalt + password;
            byte[] hashBytes = SHA256.HashData(Encoding.UTF8.GetBytes(saltedPassword));
            string computedHash = Convert.ToBase64String(hashBytes);

            return computedHash == storedHash;
        }

       
        private string GenerateJwtToken(User user)
{
    var claims = new List<Claim>
    {
        new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
        new Claim(ClaimTypes.Email, user.Email),
        new Claim("Role", user.Role.ToString())
    };

    // Safely retrieve JWT configuration values with validation
    string jwtKey = _configuration["Jwt:Key"] ?? throw new InvalidOperationException("JWT Key is not configured.");
    string jwtIssuer = _configuration["Jwt:Issuer"] ?? throw new InvalidOperationException("JWT Issuer is not configured.");
    string jwtAudience = _configuration["Jwt:Audience"] ?? throw new InvalidOperationException("JWT Audience is not configured.");

    // Create security key and credentials
    var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey));
    var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

    // Generate the token
    var token = new JwtSecurityToken(
        issuer: jwtIssuer,
        audience: jwtAudience,
        claims: claims,
        expires: DateTime.UtcNow.AddHours(1),
        signingCredentials: creds
    );

    return new JwtSecurityTokenHandler().WriteToken(token);
}

    }
}
