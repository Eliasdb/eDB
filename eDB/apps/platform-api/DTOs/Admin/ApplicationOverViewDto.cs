namespace PlatformAPI.DTOs.Admin;

public class ApplicationOverviewDto
{
  public required string ApplicationName { get; set; }
  public required string ApplicationIconUrl { get; set; }
  public required string ApplicationRoutePath { get; set; }
  public required List<string> ApplicationTags { get; set; }
  public required string ApplicationDescription { get; set; }
  public required int ApplicationId { get; set; }
  public int SubscriberCount { get; set; } // New property for subscriber count
  public List<SubscriptionDto> SubscribedUsers { get; set; } = [];
}
