// Services/NotificationWriter.cs
using Edb.AdminAPI.Contracts;
using Edb.AdminAPI.DTOs;
using Edb.AdminAPI.Hubs; // your NotificationHub (see §2)
using EDb.DataAccess.Data;
using EDb.Domain.Entities;
using Microsoft.AspNetCore.SignalR;

public interface INotificationWriter
{
    Task<Notification> WriteOrderCreatedAsync(OrderCreatedV1 e, CancellationToken ct);
}

public class NotificationWriter : INotificationWriter
{
    private readonly MyDbContext _db;
    private readonly IHubContext<NotificationHub>? _notifHub; // optional
    private readonly string _userId;

    public NotificationWriter(
        MyDbContext db,
        IConfiguration cfg,
        IHubContext<NotificationHub>? notifHub = null
    )
    {
        _db = db;
        _notifHub = notifHub;
        _userId = cfg["Admin:SingletonUserId"] ?? "singleton-admin";
    }

    public async Task<Notification> WriteOrderCreatedAsync(OrderCreatedV1 e, CancellationToken ct)
    {
        var notif = new Notification
        {
            Type = "order.created",
            Severity = NotificationSeverity.Success,
            Title = $"New order {e.Id.ToString()[..8]}…",
            Message = $"{e.FullName} • {e.Amount:C}",
            Href = $"/admin/orders/{e.Id}",
            DedupeKey = $"order.created:{e.Id}",
        };
        notif.Recipients.Add(
            new NotificationRecipient { NotificationId = notif.Id, UserId = _userId }
        );

        _db.Notifications.Add(notif);
        await _db.SaveChangesAsync(ct);

        // Optional live push to the notifications hub
        if (_notifHub is not null)
        {
            var dto = new NotificationDto(
                notif.Id,
                notif.Type,
                notif.Severity.ToString(),
                notif.Title,
                notif.Message,
                notif.Href,
                notif.CreatedAt,
                Read: false
            );
            await _notifHub.Clients.All.SendAsync("NotificationCreated", dto, ct);
        }

        return notif;
    }
}
