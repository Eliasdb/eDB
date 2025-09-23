namespace Edb.AdminAPI.DTOs.Admin;

public class ApplicationOverviewDto
{
    public required string Name { get; set; }
    public required string Description { get; set; }
    public required int Id { get; set; }
    public required string RoutePath { get; set; }
    public required List<string> Tags { get; set; }
    public required string IconUrl { get; set; }
    public List<SubscriptionDto> SubscribedUsers { get; set; } = [];
    public int SubscriberCount { get; set; }
}
