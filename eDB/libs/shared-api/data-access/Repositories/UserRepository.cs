// using EDb.DataAccess.Data;
// using EDb.Domain.Entities;
// using EDb.Domain.Interfaces;
// using Microsoft.EntityFrameworkCore;

// namespace EDb.DataAccess.Repositories;

// public class UserRepository(MyDbContext context) : IUserRepository
// {
//   private readonly MyDbContext _context = context;

//   public IQueryable<User> GetUsers()
//   {
//     // Return all users with no tracking for better performance
//     return _context.Users.AsNoTracking();
//   }

//   public async Task<User?> GetByIdAsync(int id)
//   {
//     return await _context.Users.FirstOrDefaultAsync(u => u.Id == id);
//   }

//   public async Task DeleteAsync(User user)
//   {
//     _context.Users.Remove(user);
//     await Task.CompletedTask; // This is to align with async APIs
//   }

//   public async Task AddAsync(User user)
//   {
//     await _context.Users.AddAsync(user);
//   }

//   public async Task<bool> ExistsByEmailAsync(string email)
//   {
//     return await _context.Users.AnyAsync(u => u.Email == email);
//   }

//   public async Task SaveChangesAsync()
//   {
//     await _context.SaveChangesAsync();
//   }
// }

// // archived
