namespace EDb.Domain.Entities.Notifications;

public class NotificationRecipient
{
    public Guid NotificationId { get; set; }
    public string UserId { get; set; } = default!; // ⬅️ was Guid

    public DateTime? ReadAt { get; set; }

    public Notification Notification { get; set; } = default!;
}
