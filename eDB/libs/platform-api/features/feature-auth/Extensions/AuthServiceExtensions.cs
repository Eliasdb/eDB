using System.Text;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.IdentityModel.Tokens;

namespace EDb.FeatureAuth.Extensions
{
  public static class AuthServiceExtensions
  {
    public static IServiceCollection AddAuthServices(
      this IServiceCollection services,
      IConfiguration config
    )
    {
      var redisConnectionString = config.GetConnectionString("Redis");
      if (string.IsNullOrEmpty(redisConnectionString))
      {
        throw new InvalidOperationException("Redis connection string is not configured.");
      }

      services.AddStackExchangeRedisCache(options =>
      {
        options.Configuration = redisConnectionString;
        options.InstanceName = "Sessionv2_";
      });

      services.AddDistributedMemoryCache();

      services.AddSession(options =>
      {
        options.IdleTimeout = TimeSpan.FromMinutes(30);
        options.Cookie.HttpOnly = true;
        options.Cookie.IsEssential = true;
        // options.Cookie.SecurePolicy = CookieSecurePolicy.Always; // Enforce HTTPS in production
        options.Cookie.SameSite = SameSiteMode.Lax;
      });

      services.AddHttpContextAccessor();

      // Configure both Cookie and JWT Bearer authentication
      services
        .AddAuthentication(options =>
        {
          // Set your default scheme to cookies (or choose based on your needs)

          options.DefaultAuthenticateScheme = CookieAuthenticationDefaults.AuthenticationScheme;
          options.DefaultChallengeScheme = CookieAuthenticationDefaults.AuthenticationScheme;
          options.DefaultSignOutScheme = CookieAuthenticationDefaults.AuthenticationScheme;
        })
        .AddCookie(options =>
        {
          options.LoginPath = "/api/auth/login";
          options.LogoutPath = "/api/auth/logout";
          options.AccessDeniedPath = "/auth/access-denied";
          options.Cookie.Path = "/";
          options.Cookie.Name = "AuthSession";
          options.Cookie.HttpOnly = true;
          // options.Cookie.SecurePolicy = CookieSecurePolicy.Always;
          options.ExpireTimeSpan = TimeSpan.FromMinutes(30);
          options.SlidingExpiration = true;

          var sessionDomain = config["SESSION_DOMAIN"];
          if (!string.IsNullOrEmpty(sessionDomain))
          {
            options.Cookie.Domain = sessionDomain; // For cross-app integration (e.g. with Laravel)
          }

#if DEBUG
          options.Cookie.SecurePolicy = CookieSecurePolicy.None;
          options.Cookie.SameSite = SameSiteMode.Lax; // For local development over HTTP
#else
          options.Cookie.SecurePolicy = Microsoft.AspNetCore.Http.CookieSecurePolicy.Always;
          options.Cookie.SameSite = SameSiteMode.None; // Needed for cross-origin scenarios
#endif
          options.Cookie.MaxAge = TimeSpan.FromMinutes(30);
        });
      // .AddJwtBearer(options =>
      // {
      //   var jwtKey = config["Jwt:Key"];
      //   if (string.IsNullOrEmpty(jwtKey))
      //   {
      //     throw new InvalidOperationException("JWT Key is not configured.");
      //   }
      //   var issuer = config["Jwt:Issuer"];
      //   var audience = config["Jwt:Audience"];
      //   options.TokenValidationParameters = new TokenValidationParameters
      //   {
      //     ValidateIssuer = true,
      //     ValidateAudience = true,
      //     ValidateLifetime = true,
      //     ValidateIssuerSigningKey = true,
      //     ValidIssuer = issuer,
      //     ValidAudience = audience,
      //     IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey)),
      //   };
      // });

      // Add Authorization Policies
      services
        .AddAuthorizationBuilder()
        .AddPolicy("AdminPolicy", policy => policy.RequireRole("Admin"))
        .AddPolicy("UserOrAdminPolicy", policy => policy.RequireRole("User", "Admin"));

      return services;
    }
  }
}
