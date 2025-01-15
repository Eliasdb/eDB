using System.Security.Claims;

namespace api.Interfaces
{
    public interface IApplicationsService
    {
        Task<List<ApplicationDto>> GetApplicationsAsync();
        Task<IEnumerable<ApplicationDto>> GetSubscribedApplicationsAsync(int userId);
        Task<string> ToggleSubscriptionAsync(int userId, int applicationId);
        int? GetAuthenticatedUserId(ClaimsPrincipal user);
    }
}
