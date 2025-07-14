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
          }
        );

        context.SaveChanges();
      }
    }
  }
}
