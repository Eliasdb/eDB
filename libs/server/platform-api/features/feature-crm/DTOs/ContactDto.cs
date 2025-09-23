namespace EDb.FeatureCrm.DTOs;

public class ContactDto
{
    public Guid Id { get; set; }
    public string FirstName { get; set; } = default!;
    public string LastName { get; set; } = default!;
    public string? Email { get; set; }
    public string? Phone { get; set; }

    public Guid CompanyId { get; set; }
    public string CompanyName { get; set; } = default!; // 👈 NEW

    public string Status { get; set; } = "Lead"; // 👈 NEW (or enum)
}
