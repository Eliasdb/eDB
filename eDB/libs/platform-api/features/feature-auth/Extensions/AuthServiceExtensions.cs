using System.Text;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication.OpenIdConnect;
using Microsoft.IdentityModel.Protocols.OpenIdConnect;
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
      services.AddHttpContextAccessor();
      services.AddDistributedMemoryCache();

      services
        .AddAuthentication(options =>
        {
          options.DefaultScheme = CookieAuthenticationDefaults.AuthenticationScheme;
          options.DefaultChallengeScheme = OpenIdConnectDefaults.AuthenticationScheme;
        })
        .AddCookie(options =>
        {
          options.Cookie.SecurePolicy = CookieSecurePolicy.Always; // ✅ Always mark cookies as secure
          options.Cookie.SameSite = SameSiteMode.None; // ✅ Allow cross-site requests
          options.Cookie.HttpOnly = true; // ✅ Prevent JavaScript access
        });
      // .AddOpenIdConnect(options =>
      // {
      //   options.Authority = "http://localhost:8080/realms/EDB";
      //   options.ClientId = "platform-api";
      //   options.ClientSecret = "jM7vBdWzjUYs7DvdzvayrHWjnvWSxwKJ";
      //   options.ResponseType = OpenIdConnectResponseType.Code;
      //   options.RequireHttpsMetadata = false;

      //   options.Scope.Add("openid");
      //   options.Scope.Add("profile");
      //   options.Scope.Add("email");

      //   options.SaveTokens = true;
      //   options.GetClaimsFromUserInfoEndpoint = true;

      //   options.CallbackPath = "/signin-oidc";

      //   options.TokenValidationParameters = new TokenValidationParameters
      //   {
      //     NameClaimType = "preferred_username",
      //     RoleClaimType = "roles",
      //     ValidateIssuer = true,
      //   };

      // Ensure proper redirection
      // options.Events = new OpenIdConnectEvents
      // {
      //   OnRedirectToIdentityProvider = async context =>
      //   {
      //     context.ProtocolMessage.IssuerAddress =
      //       "http://localhost:8080/realms/EDB/protocol/openid-connect/auth";
      //     Console.WriteLine("Redirecting to: " + context.ProtocolMessage.IssuerAddress);
      //     await Task.CompletedTask;
      //   },
      //   OnMessageReceived = context =>
      //   {
      //     Console.WriteLine("OnMessageReceived");
      //     return Task.CompletedTask;
      //   },
      //   OnAuthenticationFailed = context =>
      //   {
      //     Console.WriteLine("Authentication failed: " + context.Exception);
      //     context.HandleResponse();
      //     return Task.CompletedTask;
      //   },
      // };
      // });

      return services;
    }
  }
}
