

public class Application
{
    public int Id { get; set; }
    public required string Name { get; set; }
    public required string Description { get; set; }
    public required string IconUrl { get; set; } // URL to an icon for the app
    public required string RoutePath { get; set; } // Path to access this app
    public List<string> Tags { get; set; } = new(); // List of tags associated with the application
    public ICollection<Subscription> Subscriptions { get; set; } = new List<Subscription>();

}
