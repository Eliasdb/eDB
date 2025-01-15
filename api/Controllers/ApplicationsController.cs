using api.Attributes;
using api.DTOs.Applications;
using api.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace api.Controllers
{
    public class ApplicationsController(IApplicationsService applicationsService)
        : BaseApiController
    {
        private readonly IApplicationsService _applicationsService = applicationsService;

        [HttpGet]
        [RoleAuthorize("User")]
        public async Task<ActionResult<IEnumerable<ApplicationDto>>> GetApplications()
        {
            var applications = await _applicationsService.GetApplicationsAsync();
            return Ok(applications);
        }

        [HttpPost("subscribe")]
        [RoleAuthorize("User")]
        public async Task<IActionResult> SubscribeToApplication([FromBody] SubscribeRequest request)
        {
            var userId = _applicationsService.GetAuthenticatedUserId(User);
            if (userId == null)
            {
                return Unauthorized(new { message = "User is not authenticated." });
            }

            var result = await _applicationsService.ToggleSubscriptionAsync(
                userId.Value,
                request.ApplicationId
            );

            return Ok(new { message = result });
        }

        [HttpGet("user")]
        [RoleAuthorize("User")]
        public async Task<ActionResult<IEnumerable<ApplicationDto>>> GetUserApplications()
        {
            var userId = _applicationsService.GetAuthenticatedUserId(User);
            if (userId == null)
            {
                return Unauthorized(new { message = "User is not authenticated!" });
            }

            var subscribedApplications = await _applicationsService.GetSubscribedApplicationsAsync(
                userId.Value
            );

            return Ok(subscribedApplications);
        }
    }
}
