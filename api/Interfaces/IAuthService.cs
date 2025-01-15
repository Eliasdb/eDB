using api.DTOs.Admin;
using api.DTOs.Auth;
using api.Models;

namespace api.Interfaces
{
    public interface IAuthService
    {
        Task<(bool Success, string Message, UserDto? User)> RegisterUserAsync(
            RegisterRequest request
        );
        Task<(bool Success, string Message, string? Token, UserDto? User)> LoginAsync(
            LoginRequest request
        );
    }
}
