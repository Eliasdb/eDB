using api.Data;
using api.Interfaces;
using api.Models;
using Microsoft.EntityFrameworkCore;

namespace api.Repositories
{
    public class SubscriptionRepository(MyDbContext context) : ISubscriptionRepository
    {
        private readonly MyDbContext _context = context;

        public async Task<Subscription?> GetSubscriptionAsync(int applicationId, int userId)
        {
            return await _context.Subscriptions.FirstOrDefaultAsync(s =>
                s.ApplicationId == applicationId && s.UserId == userId
            );
        }

        public async Task DeleteSubscriptionAsync(Subscription subscription)
        {
            _context.Subscriptions.Remove(subscription);
            await Task.CompletedTask; // Align with async structure
        }

        public async Task SaveChangesAsync()
        {
            await _context.SaveChangesAsync();
        }
    }
}
