using EDb.Domain.Entities.Platform;

namespace EDb.Domain.Interfaces;

public interface ISubscriptionRepository
{
    Task<Subscription?> GetSubscriptionAsync(int applicationId, string keycloakUserId);
    Task<List<Subscription>> GetSubscriptionsByUserIdAsync(string keycloakUserId);
    Task AddSubscriptionAsync(Subscription subscription);
    Task DeleteSubscriptionAsync(Subscription subscription);
    Task SaveChangesAsync();
}
