using System.Security.Claims;

namespace api.Interfaces
{
    public interface ISubscriptionService
    {
        int? GetAuthenticatedUserId(ClaimsPrincipal user);
        Task<string> ToggleSubscription(int userId, int applicationId);
        Task<IEnumerable<ApplicationDto>> GetSubscribedApplications(int userId);
    }
}
