using api.Models;

namespace api.Interfaces
{
    public interface IUserRepository
    {
        IQueryable<User> GetUsers();
        Task<User?> GetByIdAsync(int id);

        // Task AddAsync(User user);
        Task DeleteAsync(User user);
        Task SaveChangesAsync();
    }
}
