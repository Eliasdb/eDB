namespace EDb.FeatureApplications.DTOs;

public class ApplicationDto
{
  public int Id { get; set; }
  public string Name { get; set; } = string.Empty;
  public string Description { get; set; } = string.Empty;
  public string IconUrl { get; set; } = string.Empty;
  public string RoutePath { get; set; } = string.Empty; // Path to access this app
  public bool IsSubscribed { get; set; }
  public List<string> Tags { get; set; } = new(); // List of tags associated with the application
}
