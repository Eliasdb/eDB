using EDb.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace EDb.DataAccess.Data;

public class MyDbContext(DbContextOptions<MyDbContext> options) : DbContext(options)
{
    public DbSet<Application> Applications { get; set; }
    public DbSet<Subscription> Subscriptions { get; set; }

    // NEW
    public DbSet<Notification> Notifications { get; set; }
    public DbSet<NotificationRecipient> NotificationRecipients { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // ===== Existing =====
        modelBuilder.Entity<Application>().HasKey(a => a.Id);
        modelBuilder.Entity<Subscription>().HasKey(s => s.Id);

        modelBuilder
            .Entity<Subscription>()
            .HasOne(s => s.Application)
            .WithMany(a => a.Subscriptions)
            .HasForeignKey(s => s.ApplicationId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<Subscription>().Property(s => s.KeycloakUserId).IsRequired();

        modelBuilder.Entity<Subscription>().HasIndex(s => s.KeycloakUserId);
        modelBuilder.Entity<Subscription>().HasIndex(s => s.ApplicationId);

        // ===== NEW: Notifications =====
        modelBuilder.Entity<Notification>(b =>
        {
            b.ToTable("notifications");
            b.HasKey(n => n.Id);

            b.Property(n => n.Type).HasColumnName("type").IsRequired();

            b.Property(n => n.Severity)
                .HasColumnName("severity")
                .HasConversion<string>() // enum as text
                .HasMaxLength(16)
                .IsRequired();

            b.Property(n => n.Title).HasColumnName("title").IsRequired();

            b.Property(n => n.Message).HasColumnName("message");
            b.Property(n => n.Href).HasColumnName("href");

            // If using PostgreSQL (Npgsql):
            b.Property(n => n.Payload).HasColumnName("payload").HasColumnType("jsonb");

            // If not using Postgres, remove .HasColumnType("jsonb") and let EF choose.

            b.Property(n => n.DedupeKey).HasColumnName("dedupe_key");

            // Default UTC timestamp (Postgres). For SQL Server use: "SYSUTCDATETIME()"
            b.Property(n => n.CreatedAt)
                .HasColumnName("created_at")
                .HasDefaultValueSql("timezone('utc', now())");

            b.Property(n => n.ExpiresAt).HasColumnName("expires_at");

            // Indexes
            b.HasIndex(n => n.CreatedAt).HasDatabaseName("ix_notifications_created");

            // Unique filtered index for idempotency
            b.HasIndex(n => n.DedupeKey)
                .IsUnique()
                .HasFilter("\"dedupe_key\" IS NOT NULL") // Postgres filter syntax
                .HasDatabaseName("ix_notifications_dedupe");

            // Relationship configured from recipient side
            b.HasMany(n => n.Recipients)
                .WithOne(r => r.Notification)
                .HasForeignKey(r => r.NotificationId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        // ===== NEW: NotificationRecipients =====
        // in MyDbContext.OnModelCreating(...)
        modelBuilder.Entity<NotificationRecipient>(b =>
        {
            b.ToTable("notification_recipients");
            b.HasKey(r => new { r.NotificationId, r.UserId });

            b.Property(r => r.NotificationId).HasColumnName("notification_id");
            b.Property(r => r.UserId).HasColumnName("user_id"); // string now
            b.Property(r => r.ReadAt).HasColumnName("read_at");

            b.HasIndex(r => r.UserId).HasDatabaseName("ix_recipients_user");
            b.HasIndex(r => r.UserId)
                .HasFilter("\"read_at\" IS NULL")
                .HasDatabaseName("ix_recipients_user_unread");
        });
    }
}
