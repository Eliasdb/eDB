using EDb.DataAccess.Data;
using EDb.Domain.Entities;
using EDb.Domain.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace EDb.DataAccess.Repositories
{
  public class ApplicationRepository(MyDbContext context) : IApplicationRepository
  {
    private readonly MyDbContext _context = context;

    public async Task<List<Application>> GetApplicationsAsync()
    {
      return await _context
        .Applications.Include(a => a.Subscriptions)
        .ThenInclude(s => s.User)
        .AsNoTracking()
        .ToListAsync();
    }

    public async Task<Application?> GetByIdAsync(int id)
    {
      return await _context.Applications.FirstOrDefaultAsync(a => a.Id == id);
    }

    public async Task AddApplicationAsync(Application application)
    {
      await _context.Applications.AddAsync(application);
    }

    public async Task UpdateApplicationAsync(Application application)
    {
      _context.Applications.Update(application); // Mark the entity as modified
      await Task.CompletedTask; // Align with async API structure
    }

    public async Task DeleteApplicationAsync(Application application)
    {
      _context.Applications.Remove(application);
      await Task.CompletedTask; // Align with async structure
    }

    public async Task SaveChangesAsync()
    {
      await _context.SaveChangesAsync();
    }
  }
}
