using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using EDb.Domain.Entities;
using Microsoft.IdentityModel.Tokens;

namespace EDb.AuthUtils;

public static class AllAuthUtils
{
  public static (string Hash, string Salt) HashPassword(string password)
  {
    byte[] saltBytes = RandomNumberGenerator.GetBytes(16);
    string salt = Convert.ToBase64String(saltBytes);

    string saltedPassword = salt + password;
    byte[] hashBytes = SHA256.HashData(Encoding.UTF8.GetBytes(saltedPassword));
    string hash = Convert.ToBase64String(hashBytes);

    return (hash, salt);
  }

  public static bool VerifyPassword(string password, string storedHash, string storedSalt)
  {
    string saltedPassword = storedSalt + password;
    byte[] hashBytes = SHA256.HashData(Encoding.UTF8.GetBytes(saltedPassword));
    string computedHash = Convert.ToBase64String(hashBytes);

    return computedHash == storedHash;
  }

  public static string GenerateJwtToken(User user, IConfiguration configuration)
  {
    var now = DateTime.UtcNow;

    // Include standard claims for compatibility with Laravel's JWT library.
    var claims = new List<Claim>
    {
      // "sub" is the standard subject claim expected by many JWT libraries.
      new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
      // "jti" provides a unique identifier for the token.
      new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
      // "iat" represents the time at which the token was issued.
      new Claim(
        JwtRegisteredClaimNames.Iat,
        new DateTimeOffset(now).ToUnixTimeSeconds().ToString(),
        ClaimValueTypes.Integer64
      ),
      // You can also keep your custom claims if needed.
      new Claim(ClaimTypes.Email, user.Email),
      new Claim(ClaimTypes.Role, user.Role.ToString()),
    };

    var jwtKey =
      configuration["Jwt:Key"] ?? throw new InvalidOperationException("JWT Key is not configured.");
    var jwtIssuer =
      configuration["Jwt:Issuer"]
      ?? throw new InvalidOperationException("JWT Issuer is not configured.");
    var jwtAudience =
      configuration["Jwt:Audience"]
      ?? throw new InvalidOperationException("JWT Audience is not configured.");

    var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey));
    var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

    var token = new JwtSecurityToken(
      issuer: jwtIssuer,
      audience: jwtAudience,
      claims: claims,
      notBefore: now,
      expires: now.AddHours(1),
      signingCredentials: creds
    );

    return new JwtSecurityTokenHandler().WriteToken(token);
  }
}
