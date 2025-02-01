using System.Security.Claims;
using EDb.Domain.Entities;
using PlatformAPI.DTOs.Profile;

namespace PlatformAPI.Interfaces;

public interface IProfileService
{
  Task<User?> GetAuthenticatedUserAsync(ClaimsPrincipal userPrincipal);
  ProfileSettingsResponse? GetUserProfile(User user);
  Task UpdateUserProfileAsync(User user, ProfileUpdateRequest request);
}
