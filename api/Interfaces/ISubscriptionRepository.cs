using api.Models;

namespace api.Interfaces
{
    public interface ISubscriptionRepository
    {
        Task<Subscription?> GetSubscriptionAsync(int applicationId, int userId);
        Task<List<Subscription>> GetSubscriptionsByUserIdAsync(int userId);
        Task AddSubscriptionAsync(Subscription subscription);
        Task DeleteSubscriptionAsync(Subscription subscription);
        Task SaveChangesAsync();
    }
}
