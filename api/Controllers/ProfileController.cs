using System.Security.Claims;
using api.Attributes;
using api.DTOs.Profile;
using api.Services;
using Microsoft.AspNetCore.Mvc;

namespace api.Controllers
{
    [ApiController]
    [Route("api/profile")]
    [RoleAuthorize("User", "Admin")]
    public class ProfileController(ProfileService profileService) : ControllerBase
    {
        private readonly ProfileService _profileService = profileService;

        [HttpGet("settings")]
        public async Task<IActionResult> GetProfileSettings()
        {
            var user = await _profileService.GetAuthenticatedUserAsync(HttpContext.User);
            if (user == null)
            {
                return Unauthorized(
                    new { error = "Unauthorized", message = "User not authenticated!" }
                );
            }

            var response = _profileService.GetUserProfile(user);
            if (response == null)
            {
                return NotFound(
                    new { error = "NotFound", message = "Profile could not be mapped." }
                );
            }

            return Ok(response);
        }

        [HttpPut("update")]
        public async Task<IActionResult> UpdateProfile([FromBody] ProfileUpdateRequest request)
        {
            var user = await _profileService.GetAuthenticatedUserAsync(HttpContext.User);
            if (user == null)
            {
                return Unauthorized(
                    new { error = "Unauthorized", message = "User not authenticated." }
                );
            }

            await _profileService.UpdateUserProfileAsync(user, request);

            var response = _profileService.GetUserProfile(user);
            return Ok(new { message = "Profile updated successfully!", user = response });
        }
    }
}
