namespace Edb.FeatureAccount.DTOs;

public class ProfileSettingsResponse
{
    public required string Email { get; set; }
    public required string FirstName { get; set; }
    public required string LastName { get; set; }
    public required string Country { get; set; }
    public required string State { get; set; }
    public required string Company { get; set; }
    public required string DisplayName { get; set; }
    public required string PreferredLanguage { get; set; }
    public required string Title { get; set; }
    public required string Address { get; set; }
}
