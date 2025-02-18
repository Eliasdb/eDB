namespace Edb.PlatformAPI.DTOs.Applications;

public class ApplicationDto
{
  public int Id { get; set; }
  public string Name { get; set; } = string.Empty;
  public string Description { get; set; } = string.Empty;
  public string IconUrl { get; set; } = string.Empty;
  public string RoutePath { get; set; } = string.Empty; // Path to access this app
  public List<string> Tags { get; set; } = new();
}
