using api.Data;
using api.Interfaces;
using api.Mapping;
using api.Repositories;
using api.Services;
using Microsoft.EntityFrameworkCore;

namespace api.Extensions;

public static class ApplicationServiceExtensions
{
    public static IServiceCollection AddApplicationServices(
        this IServiceCollection services,
        IConfiguration config
    )
    {
        services.AddDbContext<MyDbContext>(options =>
            options.UseNpgsql(config.GetConnectionString("DefaultConnection"))
        );

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
