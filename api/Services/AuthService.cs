using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using api.DTOs.Admin;
using api.DTOs.Auth;
using api.Interfaces;
using api.Models;
using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

namespace api.Services
{
    public class AuthService(
        IConfiguration configuration,
        IUserRepository userRepository,
        IMapper mapper
    ) : IAuthService
    {
        private readonly IConfiguration _configuration = configuration;
        private readonly IUserRepository _userRepository = userRepository;
        private readonly IMapper _mapper = mapper;

        public async Task<(bool Success, string Message, UserDto? User)> RegisterUserAsync(
            RegisterRequest request
        )
        {
            // Check if the email already exists
            if (await _userRepository.ExistsByEmailAsync(request.Email))
            {
                return (false, "Email already exists!", null);
            }

            // Hash the password
            var (hashedPassword, salt) = HashPassword(request.Password);

            // Map the request to a User entity
            var user = _mapper.Map<User>(request);
            user.PasswordHash = hashedPassword;
            user.Salt = salt;
            user.Role = UserRole.User;

            // Add the user to the repository
            await _userRepository.AddAsync(user);
            await _userRepository.SaveChangesAsync();

            // Map the user to a DTO
            var userDto = _mapper.Map<UserDto>(user);
            return (true, "Registration successful!", userDto);
        }

        public async Task<(bool Success, string Message, string? Token, UserDto? User)> LoginAsync(
            LoginRequest request
        )
        {
            // Fetch the user by email
            var user = await _userRepository
                .GetUsers()
                .FirstOrDefaultAsync(u => u.Email == request.Email);

            // Validate user existence and password
            if (
                user == null
                || string.IsNullOrEmpty(user.Salt)
                || !VerifyPassword(request.Password, user.PasswordHash, user.Salt)
            )
            {
                return (false, "Invalid email or password!", null, null);
            }

            // Generate JWT token
            var token = GenerateJwtToken(user);

            // Map the user to a DTO
            var userDto = _mapper.Map<UserDto>(user);

            return (true, "Login successful!", token, userDto);
        }

        public (string Hash, string Salt) HashPassword(string password)
        {
            byte[] saltBytes = RandomNumberGenerator.GetBytes(16);
            string salt = Convert.ToBase64String(saltBytes);

            string saltedPassword = salt + password;
            byte[] hashBytes = SHA256.HashData(Encoding.UTF8.GetBytes(saltedPassword));
            string hash = Convert.ToBase64String(hashBytes);

            return (hash, salt);
        }

        public bool VerifyPassword(string password, string storedHash, string storedSalt)
        {
            string saltedPassword = storedSalt + password;
            byte[] hashBytes = SHA256.HashData(Encoding.UTF8.GetBytes(saltedPassword));
            string computedHash = Convert.ToBase64String(hashBytes);

            return computedHash == storedHash;
        }

        public string GenerateJwtToken(User user)
        {
            var claims = new List<Claim>
            {
                new(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new(ClaimTypes.Email, user.Email),
                new(ClaimTypes.Role, user.Role.ToString()),
            };

            var jwtKey =
                _configuration["Jwt:Key"]
                ?? throw new InvalidOperationException("JWT Key is not configured.");
            var jwtIssuer =
                _configuration["Jwt:Issuer"]
                ?? throw new InvalidOperationException("JWT Issuer is not configured.");
            var jwtAudience =
                _configuration["Jwt:Audience"]
                ?? throw new InvalidOperationException("JWT Audience is not configured.");

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

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
