using System.Security.Claims;
using EDb.FeatureApplications.DTOs;

namespace EDb.FeatureApplications.Interfaces;

public interface IApplicationsService
{
  Task<List<ApplicationDto>> GetApplicationsAsync();
  Task<IEnumerable<ApplicationDto>> GetSubscribedApplicationsAsync(int userId);
  Task<string> ToggleSubscriptionAsync(int userId, int applicationId);
  int? GetAuthenticatedUserId(ClaimsPrincipal user);
}
