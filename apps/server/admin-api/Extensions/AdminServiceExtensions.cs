using AutoMapper;
using DotNetEnv;
using Edb.AdminAPI.Consumers;
using Edb.AdminAPI.Interfaces;
using Edb.AdminAPI.Mapping;
using Edb.AdminAPI.Services;
using EDb.DataAccess.Data;
using EDb.DataAccess.Repositories;
using EDb.Domain.Interfaces;
using MassTransit; // ⬅️ add
using Microsoft.EntityFrameworkCore;

namespace Edb.AdminAPI.Extensions;

public static class AdminServiceExtensions
{
    public static IServiceCollection AddAdminServices(
        this IServiceCollection services,
        IConfiguration config
    )
    {
        // ---------- DB (unchanged) ----------
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

            connectionString =
                $"Host={host};Port={port};Database={db};Username={user};Password={pwd}";
        }
        else
        {
            connectionString =
                config.GetConnectionString("DefaultConnection")
                ?? throw new InvalidOperationException("Missing DefaultConnection.");
        }

        services.AddDbContext<MyDbContext>(opt =>
            opt.UseNpgsql(connectionString, b => b.MigrationsAssembly("EDb.DataAccess"))
        );
        services.AddDbContext<KeycloakDbContext>(opt =>
            opt.UseNpgsql(connectionString, b => b.MigrationsAssembly("EDb.DataAccess"))
        );

        services.AddScoped<IApplicationRepository, ApplicationRepository>();
        services.AddScoped<ISubscriptionRepository, SubscriptionRepository>();
        services.AddScoped<INotificationWriter, NotificationWriter>();

        services.AddScoped<IAdminService, AdminService>();
        services.AddAutoMapper(typeof(MappingProfile).Assembly);

        // ---------- CORS (you already had this) ----------
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

        // ---------- SignalR ----------
        services.AddSignalR();

        // ---------- RabbitMQ + MassTransit ----------
        // Pull MQ settings from env in dev, from appsettings in other envs
        var mq = new RabbitMqOptions
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
        };

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
                            // Optional if non-default:
                            // h.Port(mq.Port);
                        }
                    );

                    // 👇 Use raw JSON (so plain Laravel JSON works)
                    // 👇 First clear built-in serializers
                    cfg.ClearSerialization();

                    // 👇 Then set the default serializer to raw JSON
                    cfg.UseRawJsonSerializer();

                    // 👇 Also allow raw JSON as a deserializer
                    cfg.UseRawJsonDeserializer();

                    // Laravel publishes to edb.events (topic) with routing key order.created.v1
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
                                    5,
                                    TimeSpan.FromSeconds(1),
                                    TimeSpan.FromSeconds(30),
                                    TimeSpan.FromSeconds(5)
                                )
                            );

                            e.ConfigureConsumer<OrderCreatedConsumer>(context);
                        }
                    );
                }
            );
        });

        return services;
    }

    // convenience options type
    private sealed class RabbitMqOptions
    {
        public string Host { get; set; } = "localhost";
        public string VirtualHost { get; set; } = "/";
        public string Username { get; set; } = "dev";
        public string Password { get; set; } = "dev";
    }
}
