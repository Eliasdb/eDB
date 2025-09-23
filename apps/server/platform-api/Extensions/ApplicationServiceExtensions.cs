using DotNetEnv;
using EDb.DataAccess.Data;
using EDb.DataAccess.Repositories;
using EDb.Domain.Interfaces;
using Edb.FeatureAccount.Interfaces;
using Edb.FeatureAccount.Services;
using EDb.FeatureApplications.Interfaces;
using EDb.FeatureApplications.Mapping;
using EDb.FeatureApplications.Services;
using EDb.Identity.Abstractions;
using EDb.Identity.Keycloak;
using Microsoft.EntityFrameworkCore;

namespace Edb.PlatformAPI.Extensions;

public static class ApplicationServiceExtensions
{
    public static IServiceCollection AddApplicationServices(
        this IServiceCollection services,
        IConfiguration config
    )
    {
        // ─────────────────────────────────────────────────────
        // 🔧 Load Connection String
        // ─────────────────────────────────────────────────────
        var environment = config["ASPNETCORE_ENVIRONMENT"] ?? "Production";
        string connectionString;

        if (environment == "Development")
        {
            Env.Load(); // Load from .env
            connectionString =
                $"Host={Env.GetString("DB_HOST")};Port={Env.GetString("DB_PORT")};Database={Env.GetString("DB_NAME")};Username={Env.GetString("DB_USER")};Password={Env.GetString("DB_PASSWORD")}";
        }
        else
        {
            connectionString =
                config.GetConnectionString("DefaultConnection")
                ?? throw new InvalidOperationException(
                    "Default connection string is not configured."
                );
        }

        // ─────────────────────────────────────────────────────
        // 🗃️ Database Contexts
        // ─────────────────────────────────────────────────────
        services.AddDbContext<MyDbContext>(options =>
            options.UseNpgsql(connectionString, b => b.MigrationsAssembly("EDb.DataAccess"))
        );

        // ─────────────────────────────────────────────────────
        // 🧩 Repositories
        // ─────────────────────────────────────────────────────
        services.AddScoped<IApplicationRepository, ApplicationRepository>();
        services.AddScoped<ISubscriptionRepository, SubscriptionRepository>();

        // ─────────────────────────────────────────────────────
        // 🧩 Gateways
        // ─────────────────────────────────────────────────────
        services.AddScoped<IIdentityGateway, KeycloakGateway>();

        // ─────────────────────────────────────────────────────
        // 🧠 Services
        // ─────────────────────────────────────────────────────
        services.AddScoped<IAccountService, AccountService>();
        services.AddScoped<IApplicationsService, ApplicationsService>();

        // ─────────────────────────────────────────────────────
        // 🧭 AutoMapper
        // ─────────────────────────────────────────────────────
        services.AddAutoMapper(typeof(ApplicationMappingProfile).Assembly);

        // ─────────────────────────────────────────────────────
        // 🌐 HTTP Client
        // ─────────────────────────────────────────────────────
        services.AddHttpClient();

        // ─────────────────────────────────────────────────────
        // 🌍 CORS
        // ─────────────────────────────────────────────────────
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
