using System.Security.Claims;
using AutoMapper;
using EDb.Domain.Entities;
using EDb.Domain.Interfaces;
using EDb.FeatureApplications.DTOs;
using EDb.FeatureApplications.Interfaces;
using Microsoft.Extensions.Logging;

namespace EDb.FeatureApplications.Services;

public class ApplicationsService(
  IApplicationRepository applicationRepository,
  ISubscriptionRepository subscriptionRepository,
  IUserRepository userRepository,
  IMapper mapper,
  ILogger<ApplicationsService> logger
) : IApplicationsService
{
  private readonly IApplicationRepository _applicationRepository = applicationRepository;
  private readonly ISubscriptionRepository _subscriptionRepository = subscriptionRepository;
  private readonly IUserRepository _userRepository = userRepository;
  private readonly IMapper _mapper = mapper;
  private readonly ILogger<ApplicationsService> _logger = logger;

  public async Task<List<ApplicationDto>> GetApplicationsAsync()
  {
    var applications = await _applicationRepository.GetApplicationsAsync();
    return _mapper.Map<List<ApplicationDto>>(applications);
  }

  public string? GetAuthenticatedUserId(ClaimsPrincipal userPrincipal)
  {
    // Log all claims for debugging.
    foreach (var claim in userPrincipal.Claims)
    {
      _logger.LogInformation("Claim: {Type} = {Value}", claim.Type, claim.Value);
    }

    // Retrieve the "sub" claim (Keycloak's unique user identifier).
    string? userIdClaim =
      userPrincipal.FindFirst("sub")?.Value
      ?? userPrincipal.FindFirst(ClaimTypes.NameIdentifier)?.Value;

    _logger.LogInformation(
      "Extracted external user identifier claim: {UserIdClaim}",
      userIdClaim ?? "null"
    );

    return userIdClaim; // This will return null if no claim is found
  }

  public async Task<string> ToggleSubscriptionAsync(int userId, int applicationId)
  {
    // Validate user existence
    var user = await _userRepository.GetByIdAsync(userId);
    if (user == null)
    {
      return "User not found.";
    }

    // Validate application existence
    var application = await _applicationRepository.GetByIdAsync(applicationId);
    if (application == null)
    {
      return "Application not found.";
    }

    // Check for existing subscription
    var subscription = await _subscriptionRepository.GetSubscriptionAsync(applicationId, userId);

    if (subscription != null)
    {
      // Remove subscription if exists
      await _subscriptionRepository.DeleteSubscriptionAsync(subscription);
      await _subscriptionRepository.SaveChangesAsync();
      return "Subscription removed successfully.";
    }

    // Add new subscription
    var newSubscription = new Subscription { ApplicationId = applicationId, UserId = userId };

    await _subscriptionRepository.AddSubscriptionAsync(newSubscription);
    await _subscriptionRepository.SaveChangesAsync();
    return "Subscription added successfully.";
  }

  public async Task<IEnumerable<ApplicationDto>> GetSubscribedApplicationsAsync(int userId)
  {
    var subscriptions = await _subscriptionRepository.GetSubscriptionsByUserIdAsync(userId);
    var applications = subscriptions.Select(s => s.Application);

    // Map applications to ApplicationDto
    return _mapper.Map<List<ApplicationDto>>(applications);
  }
}
