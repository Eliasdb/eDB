using EDb.FeatureApplications.DTOs;
using EDb.FeatureApplications.Interfaces;
using EDb.UtilAttributes.Attributes;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace EDb.FeatureApplications.Controllers;

public class ApplicationsController(IApplicationsService applicationsService) : BaseApiController
{
  private readonly IApplicationsService _applicationsService = applicationsService;

  [HttpGet]
  public async Task<ActionResult<IEnumerable<ApplicationDto>>> GetApplications()
  {
    // Get the general catalog
    var applications = await _applicationsService.GetApplicationsAsync();
    var userId = _applicationsService.GetAuthenticatedUserId(User);
    // If the user is authenticated, fetch their subscriptions and update the DTO
    if (userId != null)
    {
      var subscribedApplications = await _applicationsService.GetSubscribedApplicationsAsync(
        userId.Value
      );
      var subscribedIds = subscribedApplications.Select(app => app.Id).ToHashSet();
      foreach (var app in applications)
      {
        app.IsSubscribed = subscribedIds.Contains(app.Id);
      }
    }
    else
    {
      // For anonymous users, you could either default to false or simply skip
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
