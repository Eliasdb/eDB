using Microsoft.AspNetCore.Authentication.JwtBearer;

namespace Edb.PlatformAPI.Extensions;

public static class IdentityServiceExtensions
{
  public static IServiceCollection AddIdentityServices(
    this IServiceCollection services,
    IConfiguration config
  )
  {
    services
      .AddAuthentication(options =>
      {
        options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
        options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
      })
      .AddJwtBearer(options =>
      {
        // Set Keycloak as the authority (replace with your Keycloak URL and realm)
        options.Authority = "http://localhost:8080/realms/EDB";

        // Set the expected audience for your API (usually your client id)
        options.Audience = "edb-app";

        options.RequireHttpsMetadata = false;

        // Optional: additional token validation parameters if needed
        // options.TokenValidationParameters = new TokenValidationParameters { ... };
      });

    // services.AddAuthorization();

    return services;
  }
}
