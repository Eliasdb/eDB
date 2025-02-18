using Edb.PlatformAPI.DTOs.Admin;
using Edb.PlatformAPI.DTOs.Auth;

namespace Edb.PlatformAPI.Interfaces;

public interface IAuthService
{
  Task<(bool Success, string Message, UserDto? User)> RegisterUserAsync(RegisterRequest request);
  Task<(bool Success, string Message, string? Token, UserDto? User)> LoginAsync(
    LoginRequest request
  );
}
