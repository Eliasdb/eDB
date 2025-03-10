using System.Security.Claims;
using EDb.FeatureApplications.DTOs;

namespace EDb.FeatureApplications.Interfaces;

public interface IApplicationsService
{
  Task<List<ApplicationDto>> GetApplicationsAsync();
  Task<IEnumerable<ApplicationDto>> GetSubscribedApplicationsAsync(string keycloakUserId);
  Task<string> ToggleSubscriptionAsync(string keycloakUserId, int applicationId);
  string? GetAuthenticatedUserId();
}
