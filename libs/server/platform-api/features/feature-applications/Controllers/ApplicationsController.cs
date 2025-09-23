using EDb.FeatureApplications.DTOs;
using EDb.FeatureApplications.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace EDb.FeatureApplications.Controllers;

[Authorize] // ⬅️ Protects all routes in this controller
[ApiController]
[Route("api/[controller]")]
public class ApplicationsController(IApplicationsService applicationsService) : ControllerBase
{
    private readonly IApplicationsService _applicationsService = applicationsService;

    [HttpGet]
    public async Task<ActionResult<IEnumerable<ApplicationDto>>> GetApplications()
    {
        var applications = await _applicationsService.GetApplicationsAsync();

        // Keycloak always sets "sub" as the user ID claim
        var keycloakUserId = User.FindFirst("sub")?.Value;

        if (!string.IsNullOrEmpty(keycloakUserId))
        {
            var subscribedApps = await _applicationsService.GetSubscribedApplicationsAsync(
                keycloakUserId
            );
            var subscribedIds = subscribedApps.Select(app => app.Id).ToHashSet();

            foreach (var app in applications)
            {
                app.IsSubscribed = subscribedIds.Contains(app.Id);
            }
        }

        return Ok(applications);
    }

    [HttpPost("subscribe")]
    public async Task<IActionResult> SubscribeToApplication([FromBody] SubscribeRequest request)
    {
        var keycloakUserId = User.FindFirst("sub")?.Value;

        if (string.IsNullOrEmpty(keycloakUserId))
        {
            return Unauthorized(new { message = "User is not authenticated." });
        }

        var result = await _applicationsService.ToggleSubscriptionAsync(
            keycloakUserId,
            request.ApplicationId
        );
        return Ok(new { message = result });
    }

    [HttpGet("user")]
    public async Task<ActionResult<IEnumerable<ApplicationDto>>> GetUserApplications()
    {
        var keycloakUserId = User.FindFirst("sub")?.Value;

        if (string.IsNullOrEmpty(keycloakUserId))
        {
            return Unauthorized(new { message = "User is not authenticated!" });
        }

        var subscribedApps = await _applicationsService.GetSubscribedApplicationsAsync(
            keycloakUserId
        );
        return Ok(subscribedApps);
    }
}
