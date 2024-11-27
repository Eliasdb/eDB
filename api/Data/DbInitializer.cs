using api.Data;
using api.Models;
using Bogus; // For data generation

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
                    Tags = new List<string> { "Angular", ".NET" }
                },
                new Application
                {
                    Name = "Inventory",
                    Description = "Track inventory",
                    IconUrl = "/icons/inventory.png",
                    RoutePath = "/inventory",
                    Tags = new List<string> { "React", "Python" }
                },
                new Application
                {
                    Name = "Reports",
                    Description = "Generate detailed reports",
                    IconUrl = "/icons/reports.png",
                    RoutePath = "/reports",
                    Tags = new List<string> { "Vue", "Laravel", "Insights" }
                }
            );

            context.SaveChanges();
        }

        // Seed Users
        if (!context.Users.Any())
        {
            var users = GenerateUsers(100); // Generate 100 users
            context.Users.AddRange(users);
            context.SaveChanges();
        }
    }

    private static string HashPassword(string password)
    {
        return BCrypt.Net.BCrypt.HashPassword(password);
    }

    private static List<User> GenerateUsers(int count)
    {
        var faker = new Faker(); // Use Bogus for realistic data
        var users = new List<User>();

        for (int i = 1; i <= count; i++)
        {
            users.Add(new User
            {
                Email = faker.Internet.Email(),
                PasswordHash = HashPassword("password" + i), // Unique passwords
                FirstName = faker.Name.FirstName(),
                LastName = faker.Name.LastName(),
                Country = faker.Address.Country(),
                State = faker.Address.State(),
                Company = faker.Company.CompanyName(),
                DisplayName = faker.Name.FullName(),
                PreferredLanguage = faker.PickRandom(new[] { "en", "fr", "de", "es" }),
                Title = faker.Name.JobTitle(),
                Address = faker.Address.FullAddress(),
                Salt = BCrypt.Net.BCrypt.GenerateSalt(), // Generate a unique salt
                Role = i % 10 == 0 ? UserRole.Admin : (i % 5 == 0 ? UserRole.PremiumUser : UserRole.User)
            });
        }

        return users;
    }
}
