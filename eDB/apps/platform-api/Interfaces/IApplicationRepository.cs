using PlatformAPI.Models;

namespace PlatformAPI.Interfaces;

public interface IApplicationRepository
{
    Task<List<Application>> GetApplicationsAsync();
    Task<Application?> GetByIdAsync(int id); // Fetch application by ID
    Task AddApplicationAsync(Application application);
    Task UpdateApplicationAsync(Application application);
    Task DeleteApplicationAsync(Application application); // New method
    Task SaveChangesAsync();
}
