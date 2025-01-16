using System.Security.Claims;
using api.DTOs.Applications;
using api.Interfaces;
using api.Models;
using AutoMapper;

namespace api.Services
{
    public class ApplicationsService(
        IApplicationRepository applicationRepository,
        ISubscriptionRepository subscriptionRepository,
        IUserRepository userRepository,
        IMapper mapper
    ) : IApplicationsService
    {
        private readonly IApplicationRepository _applicationRepository = applicationRepository;
        private readonly ISubscriptionRepository _subscriptionRepository = subscriptionRepository;
        private readonly IUserRepository _userRepository = userRepository;
        private readonly IMapper _mapper = mapper;

        public async Task<List<ApplicationDto>> GetApplicationsAsync()
        {
            var applications = await _applicationRepository.GetApplicationsAsync();
            return _mapper.Map<List<ApplicationDto>>(applications);
        }

        public int? GetAuthenticatedUserId(ClaimsPrincipal userPrincipal)
        {
            var userIdClaim = userPrincipal.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            return int.TryParse(userIdClaim, out var userId) ? userId : (int?)null;
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
            var subscription = await _subscriptionRepository.GetSubscriptionAsync(
                applicationId,
                userId
            );

            if (subscription != null)
            {
                // Remove subscription if exists
                await _subscriptionRepository.DeleteSubscriptionAsync(subscription);
                await _subscriptionRepository.SaveChangesAsync();
                return "Subscription removed successfully.";
            }

            // Add new subscription
            var newSubscription = new Subscription
            {
                ApplicationId = applicationId,
                UserId = userId,
            };

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
}
