namespace api.Models;

public class Subscription
{
    public int Id { get; set; }
    public int UserId { get; set; } // Foreign key to the User
    public int ApplicationId { get; set; } // Foreign key to the Application
    public DateTime SubscriptionDate { get; set; }

    // Navigation Properties /
    public User? User { get; set; }
    public Application? Application { get; set; }
}
