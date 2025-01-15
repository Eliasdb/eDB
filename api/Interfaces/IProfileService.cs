using System.Security.Claims;
using api.DTOs.Profile;
using api.Models;

namespace api.Interfaces
{
    public interface IProfileService
    {
        Task<User?> GetAuthenticatedUserAsync(ClaimsPrincipal userPrincipal);
        ProfileSettingsResponse? GetUserProfile(User user);
        Task UpdateUserProfileAsync(User user, ProfileUpdateRequest request);
    }
}
