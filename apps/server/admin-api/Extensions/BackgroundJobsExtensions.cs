using System.Net;
using Edb.AdminAPI.Jobs;
using Hangfire;
using Hangfire.Dashboard;
using Hangfire.PostgreSql;

namespace EDb.AdminAPI.Extensions;

public static class BackgroundJobsExtensions
{
    public static IServiceCollection AddBackgroundJobs(
        this IServiceCollection services,
        IConfiguration config,
        IHostEnvironment env
    )
    {
        // Build a real connection string (no ${VAR} placeholders)
        var cs = BuildPostgresConnectionString(config, env);

        services.AddHangfire(cfg =>
        {
            cfg.SetDataCompatibilityLevel(CompatibilityLevel.Version_180)
                .UseSimpleAssemblyNameTypeSerializer()
                .UseRecommendedSerializerSettings()
                .UsePostgreSqlStorage(o => o.UseNpgsqlConnection(cs));
        });

        // Run workers (opt-in in dev via Hangfire:RunServerInDev=true)
        if (!env.IsDevelopment() || config.GetValue("Hangfire:RunServerInDev", true))
        {
            services.AddHangfireServer(options =>
            {
                options.WorkerCount = Math.Max(1, Environment.ProcessorCount / 2);
                options.Queues = new[] { "default" };
            });
        }

        services.AddScoped<KeycloakUserSyncJob>();
        return services;
    }

    public static IApplicationBuilder UseBackgroundJobs(
        this IApplicationBuilder app,
        IConfiguration config,
        IHostEnvironment env
    )
    {
        if (config.GetValue("Hangfire:Dashboard:Enabled", env.IsDevelopment()))
        {
            app.UseHangfireDashboard(
                "/jobs",
                new DashboardOptions { Authorization = new[] { new LocalOnlyDashboardAuth() } }
            );
        }

        var cron = config["Jobs:KeycloakUserSync:Cron"];
        if (string.IsNullOrWhiteSpace(cron))
            cron = Cron.Daily(2); // 02:00 UTC

        // ✅ Get the recurring job manager from DI
        var manager = app.ApplicationServices.GetRequiredService<IRecurringJobManager>();

        manager.AddOrUpdate<KeycloakUserSyncJob>(
            recurringJobId: "sync-keycloak-users",
            methodCall: job => job.RunFullSync(CancellationToken.None),
            cronExpression: cron,
            options: new RecurringJobOptions { TimeZone = TimeZoneInfo.Utc }
        );

        return app;
    }

    private static string BuildPostgresConnectionString(IConfiguration config, IHostEnvironment env)
    {
        var environment = config["ASPNETCORE_ENVIRONMENT"] ?? "Production";

        if (environment == "Development")
        {
            // Read from .env (DotNetEnv)
            DotNetEnv.Env.Load();
            var host = DotNetEnv.Env.GetString("DB_HOST");
            var port = DotNetEnv.Env.GetString("DB_PORT");
            var db = DotNetEnv.Env.GetString("DB_NAME");
            var user = DotNetEnv.Env.GetString("DB_USER");
            var pwd = DotNetEnv.Env.GetString("DB_PASSWORD");

            if (
                string.IsNullOrWhiteSpace(host)
                || string.IsNullOrWhiteSpace(port)
                || string.IsNullOrWhiteSpace(db)
                || string.IsNullOrWhiteSpace(user)
                || string.IsNullOrWhiteSpace(pwd)
            )
            {
                throw new InvalidOperationException(
                    "Missing DB_* env vars for Hangfire connection."
                );
            }

            return $"Host={host};Port={port};Database={db};Username={user};Password={pwd}";
        }

        // Non-dev: use a fully expanded connection string from appsettings/environment
        return config.GetConnectionString("DefaultConnection")
            ?? throw new InvalidOperationException("Missing ConnectionStrings:DefaultConnection.");
    }
}

// Keep this type at the bottom, outside the namespace is fine too
public sealed class LocalOnlyDashboardAuth : IDashboardAuthorizationFilter
{
    public bool Authorize(DashboardContext context)
    {
        var ip = context.GetHttpContext().Connection.RemoteIpAddress;
        return ip != null && IPAddress.IsLoopback(ip);
    }
}
