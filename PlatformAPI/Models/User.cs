namespace PlatformAPI.Models;

public enum UserRole
{
    User,
    Admin,
    PremiumUser,
}

public class User
{
    public int Id { get; set; }
    public required string Email { get; set; }
    public required string PasswordHash { get; set; }
    public required string FirstName { get; set; }
    public required string LastName { get; set; }
    public required string Country { get; set; }
    public required string State { get; set; }
    public required string Company { get; set; }
    public string? DisplayName { get; set; }
    public string? PreferredLanguage { get; set; }
    public string? Title { get; set; }
    public string? Address { get; set; }
    public string? Salt { get; set; }
    public UserRole Role { get; set; } = UserRole.User; // Default role
    public ICollection<Subscription> Subscriptions { get; set; } = new List<Subscription>();
}
