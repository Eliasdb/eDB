using System.Security.Claims;
using api.DTOs.Profile;
using api.Models;

namespace api.Interfaces
{
    public interface IProfileService
    {
        /// <summary>
        /// Retrieves the authenticated user based on the claims principal.
        /// </summary>
        /// <param name="userPrincipal">The claims principal representing the authenticated user.</param>
        /// <returns>The authenticated user if found; otherwise, null.</returns>
        Task<User?> GetAuthenticatedUserAsync(ClaimsPrincipal userPrincipal);

        /// <summary>
        /// Retrieves the profile settings of a user.
        /// </summary>
        /// <param name="user">The user whose profile settings are being retrieved.</param>
        /// <returns>The user's profile settings, or null if the mapping fails.</returns>
        ProfileSettingsResponse? GetUserProfile(User user);

        /// <summary>
        /// Updates the user's profile based on the provided request.
        /// </summary>
        /// <param name="user">The user entity to update.</param>
        /// <param name="request">The profile update request containing new data.</param>
        /// <returns>A task representing the asynchronous operation.</returns>
        Task UpdateUserProfileAsync(User user, ProfileUpdateRequest request);
    }
}
