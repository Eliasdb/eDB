using PlatformAPI.Models;

namespace PlatformAPI.Interfaces;

public interface ISubscriptionRepository
{
    Task<Subscription?> GetSubscriptionAsync(int applicationId, int userId);
    Task<List<Subscription>> GetSubscriptionsByUserIdAsync(int userId);
    Task AddSubscriptionAsync(Subscription subscription);
    Task DeleteSubscriptionAsync(Subscription subscription);
    Task SaveChangesAsync();
}
