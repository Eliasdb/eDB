using AutoMapper;
using DotNetEnv;
using Edb.AdminAPI.Interfaces;
using Edb.AdminAPI.Mapping;
using Edb.AdminAPI.Services;
using EDb.DataAccess.Data;
using EDb.DataAccess.Repositories;
using EDb.Domain.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Edb.AdminAPI.Extensions;

public static class AdminServiceExtensions
{
  public static IServiceCollection AddAdminServices(
    this IServiceCollection services,
    IConfiguration config
  )
  {
    // Determine environment
    var environment = config["ASPNETCORE_ENVIRONMENT"] ?? "Production";
    string connectionString;

    if (environment == "Development")
    {
      Env.Load();
      var host = Env.GetString("DB_HOST");
      var port = Env.GetString("DB_PORT");
      var db = Env.GetString("DB_NAME");
      var user = Env.GetString("DB_USER");
      var pwd = Env.GetString("DB_PASSWORD");

      connectionString = $"Host={host};Port={port};Database={db};Username={user};Password={pwd}";
    }
    else
    {
      connectionString =
        config.GetConnectionString("DefaultConnection")
        ?? throw new InvalidOperationException("Missing DefaultConnection.");
    }

    // Register DBs
    services.AddDbContext<MyDbContext>(opt =>
      opt.UseNpgsql(connectionString, b => b.MigrationsAssembly("EDb.DataAccess"))
    );

    services.AddDbContext<KeycloakDbContext>(opt =>
      opt.UseNpgsql(connectionString, b => b.MigrationsAssembly("EDb.DataAccess"))
    );

    // Register repositories and services
    services.AddScoped<IApplicationRepository, ApplicationRepository>();
    services.AddScoped<ISubscriptionRepository, SubscriptionRepository>();
    services.AddScoped<IAdminService, AdminService>();

    // AutoMapper
    services.AddAutoMapper(typeof(MappingProfile).Assembly);

    services.AddCors(options =>
    {
      options.AddPolicy(
        "AllowFrontend",
        policy =>
        {
          policy
            .WithOrigins(
              "http://localhost:4200",
              "http://localhost:4300",
              "http://localhost:8080",
              "https://keycloak.staging.eliasdebock.com",
              "https://app.staging.eliasdebock.com",
              "https://app.eliasdebock.com"
            )
            .AllowAnyMethod()
            .AllowAnyHeader()
            .AllowCredentials();
        }
      );
    });

    return services;
  }
}
