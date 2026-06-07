using EDb.FeatureApplications.DTOs;

namespace EDb.FeatureApplications.Interfaces;

public interface IApplicationsService
{
    Task<List<ApplicationDto>> GetApplicationsAsync();
    Task<IEnumerable<ApplicationDto>> GetSubscribedApplicationsAsync(
        string keycloakUserId,
        string? search = null,
        string? tag = null
    );
    Task<IEnumerable<string>> GetSubscribedApplicationTagsAsync(string keycloakUserId);
    Task<string> ToggleSubscriptionAsync(string keycloakUserId, int applicationId);
}
