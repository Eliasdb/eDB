using System.Security.Claims;
using PlatformAPI.DTOs.Profile;
using PlatformAPI.Models;

namespace PlatformAPI.Interfaces;

public interface IProfileService
{
    Task<User?> GetAuthenticatedUserAsync(ClaimsPrincipal userPrincipal);
    ProfileSettingsResponse? GetUserProfile(User user);
    Task UpdateUserProfileAsync(User user, ProfileUpdateRequest request);
}
