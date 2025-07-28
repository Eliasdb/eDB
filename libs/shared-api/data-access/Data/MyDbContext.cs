using EDb.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace EDb.DataAccess.Data;

public class MyDbContext(DbContextOptions<MyDbContext> options) : DbContext(options)
{
  // If you no longer use local users, you can remove the Users DbSet.
  // public DbSet<User> Users { get; set; }
  public DbSet<Application> Applications { get; set; }
  public DbSet<Subscription> Subscriptions { get; set; }

  protected override void OnModelCreating(ModelBuilder modelBuilder)
  {
    base.OnModelCreating(modelBuilder);

    // Configure the Users entity if still in use (for other purposes)
    // modelBuilder.Entity<User>().Property(u => u.Role).HasConversion<string>();
    // modelBuilder.Entity<User>().HasKey(u => u.Id);

    modelBuilder.Entity<Application>().HasKey(a => a.Id);
    modelBuilder.Entity<Subscription>().HasKey(s => s.Id);

    // Configure the relationship between Application and Subscription.
    modelBuilder
      .Entity<Subscription>()
      .HasOne(s => s.Application)
      .WithMany(a => a.Subscriptions)
      .HasForeignKey(s => s.ApplicationId)
      .OnDelete(DeleteBehavior.Cascade);

    // Configure KeycloakUserId as required.
    modelBuilder.Entity<Subscription>().Property(s => s.KeycloakUserId).IsRequired();

    // Define indexes for querying.
    modelBuilder.Entity<Subscription>().HasIndex(s => s.KeycloakUserId);
    modelBuilder.Entity<Subscription>().HasIndex(s => s.ApplicationId);
  }
}
