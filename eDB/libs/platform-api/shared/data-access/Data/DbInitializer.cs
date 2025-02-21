using System.Security.Cryptography;
using System.Text;
using Bogus;
using EDb.Domain.Entities;

namespace EDb.DataAccess.Data
{
  public static class DbInitializer
  {
    public static void Initialize(MyDbContext context)
    {
      // Ensure the database is created
      context.Database.EnsureCreated();

      // Seed Applications
      if (!context.Applications.Any())
      {
        context.Applications.AddRange(
          new Application
          {
            Name = "Appointments",
            Description = "Manage appointments",
            IconUrl = "/icons/appointments.png",
            RoutePath = "/appointments",
            Tags = ["Angular", ".NET"],
          },
          new Application
          {
            Name = "Inventory",
            Description = "Track inventory",
            IconUrl = "/icons/inventory.png",
            RoutePath = "/inventory",
            Tags = ["React", "Python"],
          },
          new Application
          {
            Name = "Reports",
            Description = "Generate detailed reports",
            IconUrl = "/icons/reports.png",
            RoutePath = "/reports",
            Tags = ["Vue", "Laravel", "Insights"],
          }
        );

        context.SaveChanges();
      }

      // Ensure the admin user exists.
      if (!context.Users.Any(u => u.Email == "admin@example.com"))
      {
        var (hashedPassword, salt) = HashPassword("AdminPassword123");
        context.Users.Add(
          new User
          {
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
            Address = "123 Admin Street",
          }
        );

        context.SaveChanges();
      }

      // Seed additional users
      if (context.Users.Count() <= 1) // Only seed additional users if the admin is the only user
      {
        var users = GenerateUsers(100); // Generate 100 users
        context.Users.AddRange(users);
        context.SaveChanges();
      }

      // Seed subscriptions for random users
      if (!context.Subscriptions.Any())
      {
        var subscriptions = GenerateSubscriptions(context, 50); // Generate 50 subscriptions
        context.Subscriptions.AddRange(subscriptions);
        context.SaveChanges();
      }
    }

    private static (string Hash, string Salt) HashPassword(string password)
    {
      byte[] saltBytes = RandomNumberGenerator.GetBytes(16); // Generate a 128-bit salt
      string salt = Convert.ToBase64String(saltBytes);

      string saltedPassword = salt + password; // Combine salt and password

      byte[] hashBytes = SHA256.HashData(Encoding.UTF8.GetBytes(saltedPassword)); // Hash the salted password
      string hash = Convert.ToBase64String(hashBytes);

      return (hash, salt);
    }

    private static readonly string[] items = ["en", "fr", "de", "es"];

    private static List<User> GenerateUsers(int count)
    {
      var faker = new Faker();
      var users = new List<User>();

      for (int i = 1; i <= count; i++)
      {
        var (hashedPassword, salt) = HashPassword("password" + i);

        users.Add(
          new User
          {
            Email = faker.Internet.Email(),
            PasswordHash = hashedPassword,
            Salt = salt,
            FirstName = faker.Name.FirstName(),
            LastName = faker.Name.LastName(),
            Country = faker.Address.Country(),
            State = faker.Address.State(),
            Company = faker.Company.CompanyName(),
            DisplayName = faker.Name.FullName(),
            PreferredLanguage = faker.PickRandom(items),
            Title = faker.Name.JobTitle(),
            Address = faker.Address.FullAddress(),
            Role =
              i % 10 == 0 ? UserRole.Admin : (i % 5 == 0 ? UserRole.PremiumUser : UserRole.User),
          }
        );
      }

      return users;
    }

    private static List<Subscription> GenerateSubscriptions(MyDbContext context, int count)
    {
      var faker = new Faker();
      var subscriptions = new List<Subscription>();

      // Get all users except the admin
      var userIds = context
        .Users.Where(u => u.Email != "admin@example.com")
        .Select(u => u.Id)
        .ToList();

      // Get all applications
      var applicationIds = context.Applications.Select(a => a.Id).ToList();

      for (int i = 0; i < count; i++)
      {
        var userId = faker.PickRandom(userIds);
        var applicationId = faker.PickRandom(applicationIds);

        // Avoid duplicate subscriptions
        if (!subscriptions.Any(s => s.UserId == userId && s.ApplicationId == applicationId))
        {
          subscriptions.Add(
            new Subscription
            {
              UserId = userId,
              ApplicationId = applicationId,
              SubscriptionDate = faker.Date.Past(1).ToUniversalTime(), // Random date within the past year
            }
          );
        }
      }

      return subscriptions;
    }
  }
}
