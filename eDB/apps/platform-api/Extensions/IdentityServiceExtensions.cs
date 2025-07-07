using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;

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
        options.Authority = identitySettings["Authority"];
        options.Audience = identitySettings["Audience"];
        options.RequireHttpsMetadata = false;

        options.TokenValidationParameters = new TokenValidationParameters
        {
          ValidateAudience = true,
          ValidAudience = identitySettings["Audience"],

          ValidateIssuer = true,
          ValidIssuer = identitySettings["Authority"],
        };
      });

    // services.AddAuthorization();

    return services;
  }
}
