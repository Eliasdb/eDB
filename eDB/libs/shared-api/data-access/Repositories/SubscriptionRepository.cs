using EDb.DataAccess.Data;
using EDb.Domain.Entities;
using EDb.Domain.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace EDb.DataAccess.Repositories;

public class SubscriptionRepository(MyDbContext context) : ISubscriptionRepository
{
  private readonly MyDbContext _context = context;

  public async Task<Subscription?> GetSubscriptionAsync(int applicationId, string keycloakUserId)
  {
    return await _context.Subscriptions.FirstOrDefaultAsync(s =>
      s.ApplicationId == applicationId && s.KeycloakUserId == keycloakUserId
    );
  }

  public async Task<List<Subscription>> GetSubscriptionsByUserIdAsync(string keycloakUserId)
  {
    return await _context
      .Subscriptions.Where(s => s.KeycloakUserId == keycloakUserId)
      .Include(s => s.Application) // Include related Application details.
      .AsNoTracking()
      .ToListAsync();
  }

  public async Task AddSubscriptionAsync(Subscription subscription)
  {
    await _context.Subscriptions.AddAsync(subscription);
  }

  public async Task DeleteSubscriptionAsync(Subscription subscription)
  {
    _context.Subscriptions.Remove(subscription);
    await Task.CompletedTask; // To align with async patterns.
  }

  public async Task SaveChangesAsync()
  {
    await _context.SaveChangesAsync();
  }
}
