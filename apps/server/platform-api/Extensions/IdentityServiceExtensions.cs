// Edb.PlatformAPI.Extensions.IdentityServiceExtensions.cs
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.JsonWebTokens; // 👈 add
using Microsoft.IdentityModel.Tokens;

public static class IdentityServiceExtensions
{
    public static IServiceCollection AddIdentityServices(
        this IServiceCollection services,
        IConfiguration config
    )
    {
        var identity = config.GetSection("Identity");
        var authority = identity["Authority"];
        var audience = identity["Audience"];

        // 👇 keep inbound claim types as-is (no WS-* remapping)
        JsonWebTokenHandler.DefaultMapInboundClaims = false;

        services
            .AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            })
            .AddJwtBearer(options =>
            {
                options.Authority = authority;
                options.Audience = audience;
                options.RequireHttpsMetadata = false;

                // 👇 also disable mapping at the handler level
                options.MapInboundClaims = false;

                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuer = true,
                    ValidIssuer = authority,
                    ValidateAudience = true,
                    ValidAudience = audience,

                    // ensure Name maps to what you expect (optional)
                    NameClaimType = "preferred_username",
                    RoleClaimType = "roles",
                };
            });

        services.AddAuthorization();
        return services;
    }
}
