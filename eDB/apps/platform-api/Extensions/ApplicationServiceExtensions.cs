using DotNetEnv;
using Microsoft.EntityFrameworkCore;
using PlatformAPI.Data;
using PlatformAPI.Interfaces;
using PlatformAPI.Mapping;
using PlatformAPI.Repositories;
using PlatformAPI.Services;

namespace PlatformAPI.Extensions;

public static class ApplicationServiceExtensions
{
  public static IServiceCollection AddApplicationServices(
    this IServiceCollection services,
    IConfiguration config
  )
  {
    var connectionString =
      $"Host={Env.GetString("DB_HOST")};Port={Env.GetString("DB_PORT")};Database={Env.GetString("DB_NAME")};Username={Env.GetString("DB_USER")};Password={Env.GetString("DB_PASSWORD")}";

    services.AddDbContext<MyDbContext>(options => options.UseNpgsql(connectionString));

    services.AddScoped<IUserRepository, UserRepository>();
    services.AddScoped<IApplicationRepository, ApplicationRepository>();
    services.AddScoped<ISubscriptionRepository, SubscriptionRepository>();

    services.AddScoped<IAdminService, AdminService>();
    services.AddScoped<IProfileService, ProfileService>();
    services.AddScoped<IAuthService, AuthService>();
    services.AddScoped<IApplicationsService, ApplicationsService>();

    // Add AutoMapper
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
              "https://app.staging.eliasdebock.com",
              "https://app.eliasdebock.com"
            )
            .AllowAnyMethod()
            .AllowAnyHeader();
        }
      );
    });

    return services;
  }
}
