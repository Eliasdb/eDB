using EDb.FeatureApplications.DTOs;
using EDb.FeatureApplications.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace EDb.FeatureApplications.Controllers;

public class ApplicationsController(IApplicationsService applicationsService) : BaseApiController
{
  private readonly IApplicationsService _applicationsService = applicationsService;

  [HttpGet]
  public async Task<ActionResult<IEnumerable<ApplicationDto>>> GetApplications()
  {
    // Get the general catalog.
    var applications = await _applicationsService.GetApplicationsAsync();
    var keycloakUserId = _applicationsService.GetAuthenticatedUserId(User);

    // If the user is authenticated, update each application DTO with their subscription status.
    if (keycloakUserId != null)
    {
      var subscribedApplications = await _applicationsService.GetSubscribedApplicationsAsync(
        keycloakUserId
      );
      var subscribedIds = subscribedApplications.Select(app => app.Id).ToHashSet();
      foreach (var app in applications)
      {
        app.IsSubscribed = subscribedIds.Contains(app.Id);
      }
    }
    else
    {
      // For anonymous users, mark all as unsubscribed.
      foreach (var app in applications)
      {
        app.IsSubscribed = false;
      }
    }

    return Ok(applications);
  }

  [HttpPost("subscribe")]
  public async Task<IActionResult> SubscribeToApplication([FromBody] SubscribeRequest request)
  {
    var keycloakUserId = _applicationsService.GetAuthenticatedUserId(User);
    if (keycloakUserId == null)
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
    var keycloakUserId = _applicationsService.GetAuthenticatedUserId(User);
    if (keycloakUserId == null)
    {
      return Unauthorized(new { message = "User is not authenticated!" });
    }

    var subscribedApplications = await _applicationsService.GetSubscribedApplicationsAsync(
      keycloakUserId
    );
    return Ok(subscribedApplications);
  }
}
