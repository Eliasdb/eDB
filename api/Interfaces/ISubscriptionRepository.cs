using api.Models;

namespace api.Interfaces
{
    public interface ISubscriptionRepository
    {
        Task<Subscription?> GetSubscriptionAsync(int applicationId, int userId);
        Task DeleteSubscriptionAsync(Subscription subscription);
        Task SaveChangesAsync();
    }
}
