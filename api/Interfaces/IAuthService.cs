using api.Models;

namespace api.Interfaces
{
    public interface IAuthService
    {
        (string Hash, string Salt) HashPassword(string password);
        bool VerifyPassword(string password, string storedHash, string storedSalt);
        string GenerateJwtToken(User user);
    }
}
