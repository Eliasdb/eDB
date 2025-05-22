using Edb.PlatformAPI.DTOs.Profile;
using Edb.PlatformAPI.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Edb.PlatformAPI.Controllers
{
  public class ProfileController() : BaseApiController
  {
    // private readonly IProfileService _profileService = profileService;

    // [HttpGet("settings")]
    // public async Task<ActionResult<ProfileSettingsResponse>> GetProfileSettings()
    // {
    //   var user = await _profileService.GetAuthenticatedUserAsync(HttpContext.User);
    //   if (user == null)
    //   {
    //     return Unauthorized(new { error = "Unauthorized", message = "User not authenticated!" });
    //   }

    //   var response = _profileService.GetUserProfile(user);
    //   if (response == null)
    //   {
    //     return NotFound(new { error = "NotFound", message = "Profile could not be mapped." });
    //   }

    //   return Ok(response);
    // }

    // [HttpPut("update")]
    // public async Task<IActionResult> UpdateProfile([FromBody] ProfileUpdateRequest request)
    // {
    //   var user = await _profileService.GetAuthenticatedUserAsync(HttpContext.User);
    //   if (user == null)
    //   {
    //     return Unauthorized(new { error = "Unauthorized", message = "User not authenticated." });
    //   }

    //   await _profileService.UpdateUserProfileAsync(user, request);

    //   var response = _profileService.GetUserProfile(user);
    //   return Ok(new { message = "Profile updated  successfully!", user = response });
    // }

    [HttpGet("userinfo")]
    // [Authorize]
    public async Task<IActionResult> GetKeycloakUserInfo()
    {
      var accessToken = HttpContext
        .Request.Headers.Authorization.FirstOrDefault()
        ?.Split(" ")
        .Last();

      if (string.IsNullOrEmpty(accessToken))
      {
        return Unauthorized(new { error = "Unauthorized", message = "Missing access token." });
      }

      using var httpClient = new HttpClient();
      httpClient.DefaultRequestHeaders.Authorization =
        new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", accessToken);
      httpClient.DefaultRequestHeaders.Accept.Add(
        new System.Net.Http.Headers.MediaTypeWithQualityHeaderValue("application/json")
      );

      var response = await httpClient.GetAsync(
        // "https://app.staging.eliasdebock.com/keycloak/realms/EDB%20STAGING/protocol/openid-connect/userinfo"
        "http://localhost:8080/realms/eDB/protocol/openid-connect/userinfo"
      );

      if (!response.IsSuccessStatusCode)
      {
        return StatusCode(
          (int)response.StatusCode,
          new
          {
            error = "FailedToFetch",
            message = $"Keycloak returned status {response.StatusCode}",
          }
        );
      }

      var content = await response.Content.ReadAsStringAsync();
      return Content(content, "application/json");
    }
  }
}
