using System.Security.Claims;
using AutoMapper;
using EDb.Domain.Entities;
using EDb.Domain.Interfaces;
using Edb.PlatformAPI.DTOs.Profile;
using Edb.PlatformAPI.Interfaces;

namespace Edb.PlatformAPI.Services
{
  public class ProfileService(IMapper mapper) : IProfileService
  {
    // private readonly IUserRepository _userRepository = userRepository;
    private readonly IMapper _mapper = mapper;

    // public async Task<User?> GetAuthenticatedUserAsync(ClaimsPrincipal userPrincipal)
    // {
    //   var userIdClaim = userPrincipal.FindFirst(ClaimTypes.NameIdentifier)?.Value;
    //   if (string.IsNullOrEmpty(userIdClaim))
    //   {
    //     return null; // Indicates unauthorized
    //   }

    //   int userId = int.Parse(userIdClaim);
    //   return await _userRepository.GetByIdAsync(userId);
    // }

    // public ProfileSettingsResponse? GetUserProfile(User user)
    // {
    //   return _mapper.Map<ProfileSettingsResponse>(user);
    // }

    // public async Task UpdateUserProfileAsync(User user, ProfileUpdateRequest request)
    // {
    //   _mapper.Map(request, user); // Update user fields from the request
    //   await _userRepository.SaveChangesAsync();
    // }
  }
}
