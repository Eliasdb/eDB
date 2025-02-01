using EDb.Domain.Entities;

namespace EDb.Domain.Interfaces;

public interface ISubscriptionRepository
{
  Task<Subscription?> GetSubscriptionAsync(int applicationId, int userId);
  Task<List<Subscription>> GetSubscriptionsByUserIdAsync(int userId);
  Task AddSubscriptionAsync(Subscription subscription);
  Task DeleteSubscriptionAsync(Subscription subscription);
  Task SaveChangesAsync();
}
