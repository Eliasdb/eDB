using AutoMapper;
using EDb.Domain.Entities.Platform;
using EDb.Domain.Interfaces;
using EDb.FeatureApplications.DTOs;
using EDb.FeatureApplications.Interfaces;

namespace EDb.FeatureApplications.Services;

public class ApplicationsService(
    IApplicationRepository applicationRepository,
    ISubscriptionRepository subscriptionRepository,
    IMapper mapper,
    ILogger<ApplicationsService> logger
) : IApplicationsService
{
    private readonly IApplicationRepository _applicationRepository = applicationRepository;
    private readonly ISubscriptionRepository _subscriptionRepository = subscriptionRepository;
    private readonly IMapper _mapper = mapper;
    private readonly ILogger<ApplicationsService> _logger = logger;

    public async Task<List<ApplicationDto>> GetApplicationsAsync()
    {
        var apps = await _applicationRepository.GetApplicationsAsync();
        return _mapper.Map<List<ApplicationDto>>(apps);
    }

    public async Task<string> ToggleSubscriptionAsync(string keycloakUserId, int applicationId)
    {
        var app = await _applicationRepository.GetByIdAsync(applicationId);
        if (app == null)
            return "Application not found.";

        var existing = await _subscriptionRepository.GetSubscriptionAsync(
            applicationId,
            keycloakUserId
        );
        if (existing != null)
        {
            await _subscriptionRepository.DeleteSubscriptionAsync(existing);
            await _subscriptionRepository.SaveChangesAsync();
            return "Subscription removed successfully.";
        }

        var newSub = new Subscription
        {
            ApplicationId = applicationId,
            KeycloakUserId = keycloakUserId,
            SubscriptionDate = DateTime.UtcNow,
        };

        await _subscriptionRepository.AddSubscriptionAsync(newSub);
        await _subscriptionRepository.SaveChangesAsync();
        return "Subscription added successfully.";
    }

    public async Task<IEnumerable<ApplicationDto>> GetSubscribedApplicationsAsync(
        string keycloakUserId,
        string? search = null,
        string? tag = null
    )
    {
        var subs = await _subscriptionRepository.GetSubscriptionsByUserIdAsync(keycloakUserId);
        var apps = subs.Select(s => s.Application).Where(app => app is not null).Select(app => app!);

        var normalizedSearch = search?.Trim();
        if (!string.IsNullOrWhiteSpace(normalizedSearch))
        {
            apps = apps.Where(app =>
                Contains(app.Name, normalizedSearch)
                || Contains(app.Description, normalizedSearch)
                || Contains(app.RoutePath, normalizedSearch)
                || app.Tags.Any(item => Contains(item, normalizedSearch))
            );
        }

        var normalizedTag = tag?.Trim();
        if (
            !string.IsNullOrWhiteSpace(normalizedTag)
            && !string.Equals(normalizedTag, "All apps", StringComparison.OrdinalIgnoreCase)
        )
        {
            apps = apps.Where(app =>
                app.Tags.Any(item =>
                    string.Equals(item, normalizedTag, StringComparison.OrdinalIgnoreCase)
                )
            );
        }

        return _mapper.Map<List<ApplicationDto>>(apps);
    }

    public async Task<IEnumerable<string>> GetSubscribedApplicationTagsAsync(string keycloakUserId)
    {
        var subs = await _subscriptionRepository.GetSubscriptionsByUserIdAsync(keycloakUserId);

        return subs.Select(s => s.Application)
            .Where(app => app is not null)
            .SelectMany(app => app!.Tags)
            .Where(tag => !string.IsNullOrWhiteSpace(tag))
            .Distinct(StringComparer.OrdinalIgnoreCase)
            .OrderBy(tag => tag)
            .ToList();
    }

    private static bool Contains(string? value, string search)
    {
        return value?.Contains(search, StringComparison.OrdinalIgnoreCase) == true;
    }
}
