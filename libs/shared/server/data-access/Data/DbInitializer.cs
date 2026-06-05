using EDb.Domain.Entities.Platform;
using Microsoft.Extensions.Configuration;
using Microsoft.EntityFrameworkCore;

namespace EDb.DataAccess.Data
{
    public static class DbInitializer
    {
        public static void Initialize(MyDbContext context, IConfiguration configuration)
        {
            // Ensure the database is created
            context.Database.Migrate(); // Apply migrations instead of manually creating tables?

            var claraUrl =
                configuration["CatalogApplications:ClaraUrl"]?.Trim() ?? "/clara";
            var nemesisUrl =
                configuration["CatalogApplications:NemesisUrl"]?.Trim()
                ?? "https://nemesis.eliasdebock.com";
            var propertyManagerUrl =
                configuration["CatalogApplications:PropertyManagerUrl"]?.Trim()
                ?? "https://property.eliasdebock.com";

            var seededApplications = new[]
            {
                new Application
                {
                    Name = "Webshop",
                    Description = "Demo webshop",
                    IconUrl = "https://unpkg.com/lucide-static/icons/shopping-cart.svg",
                    RoutePath = "/webshop",
                    Tags = ["Angular", "Laravel"],
                },
                new Application
                {
                    Name = "CRM",
                    Description = "Demo CRM",
                    IconUrl = "https://unpkg.com/lucide-static/icons/users.svg",
                    RoutePath = "/crm",
                    Tags = ["Angular", ".NET"],
                },
                new Application
                {
                    Name = "ERP",
                    Description = "Demo ERP",
                    IconUrl = "https://unpkg.com/lucide-static/icons/layers.svg",
                    RoutePath = "/erp",
                    Tags = ["Angular", "Python"],
                },
                new Application
                {
                    Name = "Clara",
                    Description = "AI assistant & voice/chat interface",
                    IconUrl = "https://unpkg.com/lucide-static/icons/bot.svg",
                    RoutePath = claraUrl,
                    Tags = ["React Native", "Node", "Fastify", "OpenAI", "WebRTC"],
                },
                new Application
                {
                    Name = "Nemesis",
                    Description = "Nemesis workspace",
                    IconUrl = "https://unpkg.com/lucide-static/icons/skull.svg",
                    RoutePath = nemesisUrl,
                    Tags = ["AI", "Workspace", "Automation"],
                },
                new Application
                {
                    Name = "Property Manager",
                    Description = "Property operations and management",
                    IconUrl = "https://unpkg.com/lucide-static/icons/building-2.svg",
                    RoutePath = propertyManagerUrl,
                    Tags = ["Property", "Management", "Operations"],
                },
            };

            foreach (var seededApplication in seededApplications)
            {
                var existingApplication = context.Applications.SingleOrDefault(app =>
                    app.Name == seededApplication.Name
                );

                if (existingApplication is null)
                {
                    context.Applications.Add(seededApplication);
                    continue;
                }

                existingApplication.Description = seededApplication.Description;
                existingApplication.IconUrl = seededApplication.IconUrl;
                existingApplication.RoutePath = seededApplication.RoutePath;
                existingApplication.Tags = seededApplication.Tags;
            }

            context.SaveChanges();
        }
    }
}
