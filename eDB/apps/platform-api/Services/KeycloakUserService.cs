using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

[Table("user_entity")]
public class KeycloakUser
{
  public string id { get; set; } = default!;
  public string username { get; set; } = default!;
  public string? email { get; set; } // 👈 Nullable
  public string? first_name { get; set; } // 👈 Nullable
  public string? last_name { get; set; } // 👈 Nullable
  public string realm_id { get; set; } = default!;
  public bool email_verified { get; set; }
}

public class KeycloakDbContext(DbContextOptions<KeycloakDbContext> options) : DbContext(options)
{
  public DbSet<KeycloakUser> Users => Set<KeycloakUser>();
}
