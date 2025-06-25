using Microsoft.EntityFrameworkCore;

public class KeycloakDbContext(DbContextOptions<KeycloakDbContext> options) : DbContext(options)
{
  public DbSet<KeycloakUser> Users => Set<KeycloakUser>();
}
