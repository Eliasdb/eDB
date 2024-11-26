using api.Models;
using Microsoft.EntityFrameworkCore;
using System.Security.Cryptography;
using System.Text;

namespace api.Data
{
    public class MyDbContext : DbContext
    {
        public MyDbContext(DbContextOptions<MyDbContext> options)
            : base(options)
        {
        }

        public required DbSet<User> Users { get; set; }
        public required DbSet<Application> Applications { get; set; }
        public required DbSet<UserApplication> UserApplications { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Store Role as a string in the database
            modelBuilder.Entity<User>()
                .Property(u => u.Role)
                .HasConversion<string>();

            modelBuilder.Entity<UserApplication>()
                .HasKey(ua => ua.Id);

            modelBuilder.Entity<UserApplication>()
                .HasIndex(ua => new { ua.UserId, ua.ApplicationId })
                .IsUnique(); // Ensure a user can't subscribe to the same app multiple times

            // Pre-hash password and generate salt
            var (hashedPassword, salt) = HashPassword("AdminPassword123");

            // Seed a default admin user
            modelBuilder.Entity<User>().HasData(new User
            {
                Id = 1,
                Email = "admin@example.com",
                PasswordHash = hashedPassword,
                Salt = salt,
                FirstName = "Admin",
                LastName = "User",
                Country = "Adminland",
                State = "Adminstate",
                Company = "AdminCorp",
                Role = UserRole.Admin,
                DisplayName = "Administrator",
                PreferredLanguage = "en",
                Title = "System Admin",
                Address = "123 Admin Street"
            });
        }

        // Helper method to hash password with salt
        private (string Hash, string Salt) HashPassword(string password)
        {
            byte[] saltBytes = RandomNumberGenerator.GetBytes(16); // Generate a 128-bit salt
            string salt = Convert.ToBase64String(saltBytes);

            string saltedPassword = salt + password; // Combine salt and password

            byte[] hashBytes = SHA256.HashData(Encoding.UTF8.GetBytes(saltedPassword)); // Hash the salted password
            string hash = Convert.ToBase64String(hashBytes);

            return (hash, salt);
        }
    }
}
