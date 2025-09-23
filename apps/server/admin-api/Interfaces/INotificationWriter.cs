using Edb.AdminAPI.Contracts;
using EDb.Domain.Entities.Notifications;

public interface INotificationWriter
{
    Task<Notification> WriteOrderCreatedAsync(OrderCreatedV1 e, CancellationToken ct);
}
