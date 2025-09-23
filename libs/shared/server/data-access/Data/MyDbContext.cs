using EDb.Domain.Entities.Identity;
using EDb.Domain.Entities.Notifications;
using EDb.Domain.Entities.Platform;
using Microsoft.EntityFrameworkCore;

namespace EDb.DataAccess.Data;

public class MyDbContext(DbContextOptions<MyDbContext> options) : DbContext(options)
{
    // Platform data
    public DbSet<Application> Applications { get; set; }
    public DbSet<Subscription> Subscriptions { get; set; }

    // Keycloak user data synced to my own table
    public DbSet<KeycloakUserProjection> KeycloakUsers { get; set; }

    // Admin notifications on webshop order
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

        // ===== Keycloak user projection =====
        modelBuilder.Entity<KeycloakUserProjection>(b =>
        {
            b.ToTable("keycloak_users");
            b.HasKey(u => u.Id);

            b.Property(u => u.ExternalId).HasColumnName("external_id").IsRequired();

            b.HasIndex(u => u.ExternalId)
                .IsUnique()
                .HasDatabaseName("ux_keycloak_users_external_id");

            b.Property(u => u.Username).HasColumnName("username").HasMaxLength(255);
            b.Property(u => u.Email).HasColumnName("email").HasMaxLength(320);
            b.Property(u => u.FirstName).HasColumnName("first_name").HasMaxLength(255);
            b.Property(u => u.LastName).HasColumnName("last_name").HasMaxLength(255);
            b.Property(u => u.EmailVerified).HasColumnName("email_verified");

            b.Property(u => u.SyncedAt).HasColumnName("synced_at");
            b.Property(u => u.LastSeenAt).HasColumnName("last_seen_at");
            b.Property(u => u.IsDeleted).HasColumnName("is_deleted");

            // Simple btree indexes (good starting point)
            b.HasIndex(u => u.Username).HasDatabaseName("ix_keycloak_users_username");
            b.HasIndex(u => u.Email).HasDatabaseName("ix_keycloak_users_email");
            b.HasIndex(u => u.LastName).HasDatabaseName("ix_keycloak_users_last_name");
            b.HasIndex(u => u.IsDeleted).HasDatabaseName("ix_keycloak_users_is_deleted");
        });
    }
}
