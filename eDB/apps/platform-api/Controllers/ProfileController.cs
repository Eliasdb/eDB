using Edb.PlatformAPI.DTOs.Profile;
using Edb.PlatformAPI.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Edb.PlatformAPI.Controllers
{
  public class ProfileController(IProfileService profileService) : BaseApiController
  {
    private readonly IProfileService _profileService = profileService;

    [HttpGet("settings")]
    public async Task<ActionResult<ProfileSettingsResponse>> GetProfileSettings()
    {
      var user = await _profileService.GetAuthenticatedUserAsync(HttpContext.User);
      if (user == null)
      {
        return Unauthorized(new { error = "Unauthorized", message = "User not authenticated!" });
      }

      var response = _profileService.GetUserProfile(user);
      if (response == null)
      {
        return NotFound(new { error = "NotFound", message = "Profile could not be mapped." });
      }

      return Ok(response);
    }

    [HttpPut("update")]
    public async Task<IActionResult> UpdateProfile([FromBody] ProfileUpdateRequest request)
    {
      var user = await _profileService.GetAuthenticatedUserAsync(HttpContext.User);
      if (user == null)
      {
        return Unauthorized(new { error = "Unauthorized", message = "User not authenticated." });
      }

      await _profileService.UpdateUserProfileAsync(user, request);

      var response = _profileService.GetUserProfile(user);
      return Ok(new { message = "Profile updated  successfully!", user = response });
    }
  }
}
