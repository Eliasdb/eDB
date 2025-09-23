// apps/server/admin-api/Extensions/AdminServiceExtensions.cs
using DotNetEnv;
using Edb.AdminAPI.Consumers;
using Edb.AdminAPI.Interfaces;
using Edb.AdminAPI.Mapping;
using Edb.AdminAPI.Services;
using EDb.DataAccess.Data;
using EDb.DataAccess.Repositories;
using EDb.Domain.Interfaces;
using EDb.Identity.Abstractions;
using EDb.Identity.Keycloak;
using MassTransit;
using Microsoft.EntityFrameworkCore;

namespace EDb.AdminAPI.Extensions;

public static class AdminServiceExtensions
{
    public static IServiceCollection AddAdminServices(
        this IServiceCollection services,
        IConfiguration config
    )
    {
        // ─────────────────────────────────────────────────────
        // 🔧 Configuration & Connection String
        // ─────────────────────────────────────────────────────
        var environment = config["ASPNETCORE_ENVIRONMENT"] ?? "Production";
        string connectionString;

        if (environment == "Development")
        {
            Env.Load(); // read .env for local dev
            connectionString =
                $"Host={Env.GetString("DB_HOST")};"
                + $"Port={Env.GetString("DB_PORT")};"
                + $"Database={Env.GetString("DB_NAME")};"
                + $"Username={Env.GetString("DB_USER")};"
                + $"Password={Env.GetString("DB_PASSWORD")}";
        }
        else
        {
            connectionString =
                config.GetConnectionString("DefaultConnection")
                ?? throw new InvalidOperationException("Missing DefaultConnection.");
        }

        // ─────────────────────────────────────────────────────
        // 🗃️ EF Core DbContext
        // ─────────────────────────────────────────────────────
        services.AddDbContext<MyDbContext>(opt =>
            opt.UseNpgsql(connectionString, b => b.MigrationsAssembly("EDb.DataAccess"))
        );

        // ─────────────────────────────────────────────────────
        // 🧰 Infrastructure (HTTP + typed options)
        // ─────────────────────────────────────────────────────
        services.AddHttpClient();
        services.Configure<KeycloakSettings>(config.GetSection("Keycloak"));

        // ─────────────────────────────────────────────────────
        // 🔑 Identity Gateway (Keycloak)
        // ─────────────────────────────────────────────────────
        services.AddScoped<IIdentityGateway, KeycloakGateway>();

        // ─────────────────────────────────────────────────────
        // 🧩 Repositories
        // ─────────────────────────────────────────────────────
        services.AddScoped<IApplicationRepository, ApplicationRepository>();
        services.AddScoped<ISubscriptionRepository, SubscriptionRepository>();
        services.AddScoped<INotificationWriter, NotificationWriter>();

        // ─────────────────────────────────────────────────────
        // 🧠 Application Services
        // ─────────────────────────────────────────────────────
        services.AddScoped<IAdminService, AdminService>();

        // ─────────────────────────────────────────────────────
        // 🧭 AutoMapper
        // ─────────────────────────────────────────────────────
        services.AddAutoMapper(typeof(MappingProfile).Assembly);

        // ─────────────────────────────────────────────────────
        // 🔔 SignalR
        // ─────────────────────────────────────────────────────
        services.AddSignalR();

        // ─────────────────────────────────────────────────────
        // 📨 Messaging (RabbitMQ via MassTransit)
        // ─────────────────────────────────────────────────────
        var mq = BuildRabbitMqOptions(config, environment);

        services.AddMassTransit(x =>
        {
            x.AddConsumer<OrderCreatedConsumer>();

            x.UsingRabbitMq(
                (context, cfg) =>
                {
                    cfg.Host(
                        mq.Host,
                        mq.VirtualHost,
                        h =>
                        {
                            h.Username(mq.Username);
                            h.Password(mq.Password);
                            // h.Port(mq.Port); // if you ever need a non-default port
                        }
                    );

                    // Use raw JSON so a plain Laravel publisher works fine
                    cfg.ClearSerialization();
                    cfg.UseRawJsonSerializer();
                    cfg.UseRawJsonDeserializer();

                    cfg.ReceiveEndpoint(
                        "admin.orders",
                        e =>
                        {
                            e.ConfigureConsumeTopology = false; // we bind manually

                            e.Bind(
                                "edb.events",
                                s =>
                                {
                                    s.ExchangeType = "topic";
                                    s.RoutingKey = "order.created.v1";
                                }
                            );

                            e.PrefetchCount = 16;
                            e.UseMessageRetry(r =>
                                r.Exponential(
                                    retryLimit: 5,
                                    minInterval: TimeSpan.FromSeconds(1),
                                    maxInterval: TimeSpan.FromSeconds(30),
                                    intervalDelta: TimeSpan.FromSeconds(5)
                                )
                            );

                            e.ConfigureConsumer<OrderCreatedConsumer>(context);
                        }
                    );
                }
            );
        });

        // ─────────────────────────────────────────────────────
        // 🌍 CORS (front-ends that may call Admin API)
        // ─────────────────────────────────────────────────────
        services.AddCors(options =>
        {
            options.AddPolicy(
                "AllowFrontend",
                policy =>
                    policy
                        .WithOrigins(
                            "http://localhost:4200",
                            "http://localhost:4300",
                            "http://localhost:8080",
                            "http://localhost:5098",
                            "https://keycloak.staging.eliasdebock.com",
                            "https://app.staging.eliasdebock.com",
                            "https://app.eliasdebock.com",
                            "https://api.eliasdebock.com"
                        )
                        .AllowAnyMethod()
                        .AllowAnyHeader()
                        .AllowCredentials()
            );
        });

        return services;
    }

    // ─────────────────────────────────────────────────────────
    // 🧾 Helper: read RabbitMQ options from env/config
    // ─────────────────────────────────────────────────────────
    private static RabbitMqOptions BuildRabbitMqOptions(IConfiguration config, string environment)
    {
        return new RabbitMqOptions
        {
            Host =
                environment == "Development"
                    ? (Env.GetString("RABBITMQ_HOST") ?? "localhost")
                    : (config["RabbitMq:Host"] ?? "localhost"),
            VirtualHost =
                environment == "Development"
                    ? (Env.GetString("RABBITMQ_VHOST") ?? "/")
                    : (config["RabbitMq:VirtualHost"] ?? "/"),
            Username =
                environment == "Development"
                    ? (Env.GetString("RABBITMQ_USER") ?? "dev")
                    : (config["RabbitMq:Username"] ?? "dev"),
            Password =
                environment == "Development"
                    ? (Env.GetString("RABBITMQ_PASS") ?? "dev")
                    : (config["RabbitMq:Password"] ?? "dev"),
            // Port = ... if you need it later
        };
    }

    private sealed class RabbitMqOptions
    {
        public string Host { get; set; } = "localhost";
        public string VirtualHost { get; set; } = "/";
        public string Username { get; set; } = "guest";
        public string Password { get; set; } = "guest";
        // public int Port { get; set; } = 5672;
    }
}
