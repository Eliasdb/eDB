using Microsoft.AspNetCore.Authentication.Cookies;

namespace EDb.FeatureAuth.Extensions;

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
      options.InstanceName = "Session_";
    });

    services.AddDistributedMemoryCache();

    services.AddSession(options =>
    {
      options.IdleTimeout = TimeSpan.FromMinutes(30);
      options.Cookie.HttpOnly = true;
      options.Cookie.IsEssential = true;
      // options.Cookie.SecurePolicy = CookieSecurePolicy.Always; // ✅ Enforce HTTPS
      options.Cookie.SameSite = SameSiteMode.Lax;
    });

    services.AddHttpContextAccessor();

    services
      .AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme)
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
#if DEBUG
        options.Cookie.SecurePolicy = CookieSecurePolicy.None;
        options.Cookie.SameSite = SameSiteMode.Lax; // For local development over HTTP
#else
        options.Cookie.SecurePolicy = CookieSecurePolicy.Always;
        options.Cookie.SameSite = SameSiteMode.None; // Needed for cross-origin
#endif
        options.ExpireTimeSpan = TimeSpan.FromMinutes(30);
        options.SlidingExpiration = true;
        options.Cookie.MaxAge = TimeSpan.FromMinutes(30); // Explicitly set Max-Age
      });

    // ✅ Add Authorization Policies
    services
      .AddAuthorizationBuilder()
      // ✅ Add Authorization Policies
      .AddPolicy("AdminPolicy", policy => policy.RequireRole("Admin"))
      // ✅ Add Authorization Policies
      .AddPolicy("UserOrAdminPolicy", policy => policy.RequireRole("User", "Admin"));

    return services;
  }
}
