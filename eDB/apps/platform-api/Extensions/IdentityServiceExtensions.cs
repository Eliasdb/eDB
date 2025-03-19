using Microsoft.AspNetCore.Authentication.JwtBearer;

namespace Edb.PlatformAPI.Extensions;

public static class IdentityServiceExtensions
{
  public static IServiceCollection AddIdentityServices(
    this IServiceCollection services,
    IConfiguration config
  )
  {
    var identitySettings = config.GetSection("Identity");

    services
      .AddAuthentication(options =>
      {
        options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
        options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
      })
      .AddJwtBearer(options =>
      {
        // Use the configuration values
        options.Authority = identitySettings["Authority"];
        options.Audience = identitySettings["Audience"];
        options.RequireHttpsMetadata = false;

        // Optional: additional token validation params
        // options.TokenValidationParameters = new TokenValidationParameters { ... };
      });

    // services.AddAuthorization();

    return services;
  }
}
