using DotNetEnv;
using EDb.DataAccess.Data;
using EDb.DataAccess.Repositories;
using EDb.Domain.Interfaces;
using EDb.FeatureApplications.Interfaces;
using EDb.FeatureApplications.Mapping;
using EDb.FeatureApplications.Services;
using Edb.PlatformAPI.Interfaces;
using Edb.PlatformAPI.Mapping;
using Edb.PlatformAPI.Services;
using Microsoft.EntityFrameworkCore;

namespace Edb.PlatformAPI.Extensions
{
  public static class ApplicationServiceExtensions
  {
    public static IServiceCollection AddApplicationServices(
      this IServiceCollection services,
      IConfiguration config
    )
    {
      // Determine the current environment. Default to "Production" if not set.
      var environment = config["ASPNETCORE_ENVIRONMENT"] ?? "Production";

      string connectionString;

      if (environment == "Development")
      {
        // For development, load environment variables from the .env file.
        Env.Load();

        var host = Env.GetString("DB_HOST");
        var port = Env.GetString("DB_PORT");
        var database = Env.GetString("DB_NAME");
        var username = Env.GetString("DB_USER");
        var password = Env.GetString("DB_PASSWORD");

        connectionString =
          $"Host={host};Port={port};Database={database};Username={username};Password={password}";
      }
      else
      {
        // For staging and production, use the full connection string directly from configuration.
        // This expects that your secret populates the environment variable
        // "ConnectionStrings__DefaultConnection", which maps to config key "ConnectionStrings:DefaultConnection".
        connectionString =
          config.GetConnectionString("DefaultConnection")
          ?? throw new InvalidOperationException("Default connection string is not configured.");
        // Alternatively, you could use:
        // connectionString = config["ConnectionStrings:DefaultConnection"];
      }

      services.AddDbContext<MyDbContext>(options =>
        options.UseNpgsql(connectionString, b => b.MigrationsAssembly("EDb.DataAccess"))
      );

      services.AddDbContext<KeycloakDbContext>(options =>
        options.UseNpgsql(connectionString, b => b.MigrationsAssembly("EDb.DataAccess"))
      );

      // Register repositories
      services.AddScoped<IApplicationRepository, ApplicationRepository>();
      services.AddScoped<ISubscriptionRepository, SubscriptionRepository>();
      // services.AddScoped<IUserRepository, UserRepository>();

      // Register services
      // services.AddScoped<IProfileService, IProfileService>();
      services.AddScoped<IApplicationsService, ApplicationsService>();

      // Add AutoMapper with the specified mapping profile assembly.
      services.AddAutoMapper(typeof(MappingProfile).Assembly);
      services.AddAutoMapper(typeof(ApplicationMappingProfile).Assembly);

      // Configure CORS policies.
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
}
