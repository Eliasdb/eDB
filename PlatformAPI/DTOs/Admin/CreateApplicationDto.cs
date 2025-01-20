namespace PlatformAPI.DTOs.Admin;

public class CreateApplicationDto
{
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string IconUrl { get; set; } = string.Empty;
    public string RoutePath { get; set; } = string.Empty;
    public List<string> Tags { get; set; } = []; // List of tags associated with the application
}
