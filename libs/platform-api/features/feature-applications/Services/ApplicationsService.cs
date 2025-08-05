using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using AutoMapper;
using EDb.Domain.Entities;
using EDb.Domain.Interfaces;
using EDb.FeatureApplications.DTOs;
using EDb.FeatureApplications.Interfaces;

namespace EDb.FeatureApplications.Services;

public class ApplicationsService(
    IApplicationRepository applicationRepository,
    ISubscriptionRepository subscriptionRepository,
    IMapper mapper,
    ILogger<ApplicationsService> logger,
    IHttpContextAccessor httpContextAccessor // <-- Add this
) : IApplicationsService
{
    private readonly IApplicationRepository _applicationRepository = applicationRepository;
    private readonly ISubscriptionRepository _subscriptionRepository = subscriptionRepository;
    private readonly IMapper _mapper = mapper;
    private readonly ILogger<ApplicationsService> _logger = logger;
    private readonly IHttpContextAccessor _httpContextAccessor = httpContextAccessor; // <-- Store it

    public async Task<List<ApplicationDto>> GetApplicationsAsync()
    {
        var applications = await _applicationRepository.GetApplicationsAsync();
        return _mapper.Map<List<ApplicationDto>>(applications);
    }

    public string? GetAuthenticatedUserId()
    {
        var authHeader =
            _httpContextAccessor.HttpContext?.Request.Headers.Authorization.FirstOrDefault();

        if (!string.IsNullOrEmpty(authHeader) && authHeader.StartsWith("Bearer "))
        {
            var token = authHeader["Bearer ".Length..]; // Extract token
            _logger.LogInformation("Extracted Bearer Token: {Token}", token);

            try
            {
                var handler = new JwtSecurityTokenHandler();
                var jwtToken = handler.ReadJwtToken(token);

                // Log all claims from the token
                foreach (var claim in jwtToken.Claims)
                {
                    _logger.LogInformation(
                        "Token Claim: {Type} = {Value}",
                        claim.Type,
                        claim.Value
                    );
                }

                // Extract the "sub" claim (Keycloak user ID)
                var subClaim = jwtToken.Claims.FirstOrDefault(c => c.Type == "sub")?.Value;
                _logger.LogInformation(
                    "Extracted 'sub' from token: {SubClaim}",
                    subClaim ?? "null"
                );

                return subClaim;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error decoding Bearer token");
                return null;
            }
        }

        _logger.LogWarning("No Bearer token found in Authorization header.");
        return null;
    }

    public async Task<string> ToggleSubscriptionAsync(string keycloakUserId, int applicationId)
    {
        // Validate application existence.
        var application = await _applicationRepository.GetByIdAsync(applicationId);
        if (application == null)
        {
            return "Application not found.";
        }

        // Check for an existing subscription.
        var subscription = await _subscriptionRepository.GetSubscriptionAsync(
            applicationId,
            keycloakUserId
        );
        if (subscription != null)
        {
            // Remove subscription if it exists.
            await _subscriptionRepository.DeleteSubscriptionAsync(subscription);
            await _subscriptionRepository.SaveChangesAsync();
            return "Subscription removed successfully.";
        }

        // Add a new subscription.
        var newSubscription = new Subscription
        {
            ApplicationId = applicationId,
            KeycloakUserId = keycloakUserId,
            SubscriptionDate = DateTime.UtcNow,
        };

        await _subscriptionRepository.AddSubscriptionAsync(newSubscription);
        await _subscriptionRepository.SaveChangesAsync();
        return "Subscription added successfully.";
    }

    public async Task<IEnumerable<ApplicationDto>> GetSubscribedApplicationsAsync(
        string keycloakUserId
    )
    {
        var subscriptions = await _subscriptionRepository.GetSubscriptionsByUserIdAsync(
            keycloakUserId
        );
        var applications = subscriptions.Select(s => s.Application);
        return _mapper.Map<List<ApplicationDto>>(applications);
    }
}
