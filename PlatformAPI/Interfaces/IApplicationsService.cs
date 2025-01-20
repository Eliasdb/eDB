using System.Security.Claims;
using PlatformAPI.DTOs.Applications;

namespace PlatformAPI.Interfaces;

public interface IApplicationsService
{
    Task<List<ApplicationDto>> GetApplicationsAsync();
    Task<IEnumerable<ApplicationDto>> GetSubscribedApplicationsAsync(int userId);
    Task<string> ToggleSubscriptionAsync(int userId, int applicationId);
    int? GetAuthenticatedUserId(ClaimsPrincipal user);
}
