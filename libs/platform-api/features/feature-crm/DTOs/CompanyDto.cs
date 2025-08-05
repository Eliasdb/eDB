namespace EDb.FeatureCrm.DTOs;

public class CompanyDto
{
  public Guid Id { get; set; }
  public string Name { get; set; } = default!;
  public string? VatNumber { get; set; }
  public string? Website { get; set; }
}
