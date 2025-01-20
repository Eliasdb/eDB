using PlatformAPI.Models;

namespace PlatformAPI.Interfaces;

public interface IUserRepository
{
    IQueryable<User> GetUsers();
    Task<User?> GetByIdAsync(int id);
    Task<bool> ExistsByEmailAsync(string email);
    Task AddAsync(User user);
    Task DeleteAsync(User user);
    Task SaveChangesAsync();
}
