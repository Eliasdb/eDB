namespace Edb.PlatformAPI.DTOs.Admin;

public class UpdateApplicationDto
{
  public string? Name { get; set; }
  public string? Description { get; set; }
  public string? IconUrl { get; set; }
  public string? RoutePath { get; set; }
  public List<string>? Tags { get; set; }
}
