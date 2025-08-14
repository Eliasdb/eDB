// Consumers/OrderCreatedConsumer.cs
using Edb.AdminAPI.Contracts;
using Edb.AdminAPI.Hubs;
using MassTransit;
using Microsoft.AspNetCore.SignalR;

namespace Edb.AdminAPI.Consumers;

public class OrderCreatedConsumer : IConsumer<OrderCreatedV1>
{
    private readonly IHubContext<OrdersHub> _ordersHub;
    private readonly INotificationWriter _notifications;

    public OrderCreatedConsumer(IHubContext<OrdersHub> ordersHub, INotificationWriter notifications)
    {
        _ordersHub = ordersHub;
        _notifications = notifications;
    }

    public async Task Consume(ConsumeContext<OrderCreatedV1> ctx)
    {
        var e = ctx.Message;

        Console.WriteLine("🔥 Received order.created.v1:");
        // ... your logs ...

        // 1) Persist notification (+ optional live push)
        await _notifications.WriteOrderCreatedAsync(e, ctx.CancellationToken);

        // 2) Keep your live orders stream too
        await _ordersHub.Clients.All.SendAsync(
            "OrderCreated", // <- match the Angular .on('OrderCreated', ...)
            new
            {
                id = e.Id,
                amount = e.Amount,
                status = e.Status,
                createdAt = e.CreatedAt,
                customer = new
                {
                    name = e.FullName,
                    email = e.Email,
                    city = e.City,
                },
                items = e.Items.Select(i => new
                {
                    i.BookId,
                    i.BookName,
                    i.Price,
                    qty = i.Quantity,
                }),
            },
            ctx.CancellationToken
        );
    }
}
