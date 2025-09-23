using Edb.AdminAPI.Hubs;

namespace EDb.AdminAPI.Extensions;

public static class ApplicationBuilderExtensions
{
    public static WebApplication MapAdminEndpoints(this WebApplication app)
    {
        app.UseCors("AllowFrontend");
        app.MapHub<OrdersHub>("/hubs/orders");
        app.MapHub<NotificationHub>("/hubs/notifications");
        return app;
    }
}
