using api.Data;

public static class DbInitializer
{
    public static void Initialize(MyDbContext context)
    {
        if (context.Applications.Any()) return;

        context.Applications.AddRange(
            new Application { Name = "Appointments", Description = "Manage appointments", IconUrl = "/icons/appointments.png", RoutePath = "/appointments" },
            new Application { Name = "Inventory", Description = "Track inventory", IconUrl = "/icons/inventory.png", RoutePath = "/inventory" },
            new Application { Name = "Reports", Description = "Generate detailed reports", IconUrl = "/icons/reports.png", RoutePath = "/reports" }
        );

        context.SaveChanges();
    }
}
