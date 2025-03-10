using System.Security.Cryptography;
using System.Text;
using Bogus;
using EDb.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace EDb.DataAccess.Data
{
  public static class DbInitializer
  {
    public static void Initialize(MyDbContext context)
    {
      // Ensure the database is created
      context.Database.Migrate(); // Apply migrations instead of manually creating tables

      // Seed Applications
      if (!context.Applications.Any())
      {
        context.Applications.AddRange(
          new Application
          {
            Name = "Webshop",
            Description = "Demo webshop",
            IconUrl = "/icons/appointments.png",
            RoutePath = "/webshop/catalog",
            Tags = ["Angular", "Laravel"],
          },
          new Application
          {
            Name = "Inventory",
            Description = "Track inventory",
            IconUrl = "/icons/inventory.png",
            RoutePath = "/inventory",
            Tags = ["React", "Python"],
          },
          new Application
          {
            Name = "Reports",
            Description = "Generate detailed reports",
            IconUrl = "/icons/reports.png",
            RoutePath = "/reports",
            Tags = ["Vue", "Laravel", "Insights"],
          }
        );

        context.SaveChanges();
      }
    }
  }
}
