using EDb.FeatureAuth.DTOs;

namespace EDb.FeatureAuth.Interfaces;

public interface IAuthService
{
  Task<(bool Success, string Message, UserDto? User)> RegisterUserAsync(RegisterRequest request);
  Task<(bool Success, string Message, UserDto? User)> LoginAsync(LoginRequest request);
}
