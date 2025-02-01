using PlatformAPI.DTOs.Admin;
using PlatformAPI.DTOs.Auth;

namespace PlatformAPI.Interfaces;

public interface IAuthService
{
  Task<(bool Success, string Message, UserDto? User)> RegisterUserAsync(RegisterRequest request);
  Task<(bool Success, string Message, string? Token, UserDto? User)> LoginAsync(
    LoginRequest request
  );
}
