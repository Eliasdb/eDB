namespace EDb.Domain.Entities;

public class Company
{
  public Guid Id { get; set; }
  public string Name { get; set; } = default!;
  public string? VatNumber { get; set; }
  public string? Website { get; set; }

  /* NEW: one-to-many navigation to contacts */
  public List<Contact> Contacts { get; set; } = new();
}
