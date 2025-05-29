using EDb.Domain.Entities;

namespace EDb.Domain.Interfaces;

public interface IUserRepository
{
  IQueryable<User> GetUsers();
  Task<User?> GetByIdAsync(int id);
  Task<bool> ExistsByEmailAsync(string email);
  Task AddAsync(User user);
  Task DeleteAsync(User user);
  Task SaveChangesAsync();
}

// archived repository -> users aren't being managed in postgres, they are in Keycloak now
