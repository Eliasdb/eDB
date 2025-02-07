using EDb.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace EDb.DataAccess.Data;

public class MyDbContext(DbContextOptions<MyDbContext> options) : DbContext(options)
{
  public DbSet<User> Users { get; set; }
  public DbSet<Application> Applications { get; set; }
  public DbSet<Subscription> Subscriptions { get; set; }

  protected override void OnModelCreating(ModelBuilder modelBuilder)
  {
    base.OnModelCreating(modelBuilder);

    // Store Role as a string in database
    modelBuilder.Entity<User>().Property(u => u.Role).HasConversion<string>();

    // Define primary keys explicitly
    modelBuilder.Entity<User>().HasKey(u => u.Id);

    modelBuilder.Entity<Application>().HasKey(a => a.Id);

    modelBuilder.Entity<Subscription>().HasKey(s => s.Id);

    // Define relationships
    modelBuilder
      .Entity<Subscription>()
      .HasOne(s => s.Application)
      .WithMany(a => a.Subscriptions)
      .HasForeignKey(s => s.ApplicationId)
      .OnDelete(DeleteBehavior.Cascade);

    modelBuilder
      .Entity<Subscription>()
      .HasOne(s => s.User)
      .WithMany(u => u.Subscriptions)
      .HasForeignKey(s => s.UserId)
      .OnDelete(DeleteBehavior.Cascade);

    // Define indexes for foreign keys
    modelBuilder.Entity<Subscription>().HasIndex(s => s.UserId);

    modelBuilder.Entity<Subscription>().HasIndex(s => s.ApplicationId);
  }
}
