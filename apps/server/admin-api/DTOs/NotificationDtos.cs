namespace Edb.AdminAPI.DTOs;

public record NotificationDto(
    Guid Id,
    string Type,
    string Severity,
    string Title,
    string? Message,
    string? Href,
    DateTime CreatedAt,
    bool Read
);

public record PagedNotificationsDto(
    IReadOnlyList<NotificationDto> Items,
    string? NextCursor,
    int UnreadCount
);
