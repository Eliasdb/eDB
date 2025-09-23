// EDb.Domain.Entities/Notification.cs
using System.Text.Json;

namespace EDb.Domain.Entities.Notifications;

public class Notification
{
    public Guid Id { get; set; } = Guid.NewGuid();

    // Classification
    public string Type { get; set; } = default!; // e.g. "order.created"
    public NotificationSeverity Severity { get; set; } = NotificationSeverity.Info;

    // Display
    public string Title { get; set; } = default!;
    public string? Message { get; set; }
    public string? Href { get; set; }

    // Optional payload (keep PII minimal)
    public JsonDocument? Payload { get; set; }

    // Idempotency key for at-least-once processing
    public string? DedupeKey { get; set; }

    // Timestamps
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? ExpiresAt { get; set; }

    // Per-recipient read state
    public ICollection<NotificationRecipient> Recipients { get; set; } =
        new List<NotificationRecipient>();
}
