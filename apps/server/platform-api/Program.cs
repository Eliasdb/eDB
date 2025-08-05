using DotNetEnv;
using EDb.DataAccess.Data;
using Edb.FeatureAccount.Config;
using Edb.PlatformAPI.Extensions;
using Microsoft.EntityFrameworkCore;
using Scalar.AspNetCore;

var builder = WebApplication.CreateBuilder(args);

// --- Configuration Setup ---
if (builder.Environment.IsDevelopment())
{
    Env.Load();
}

builder.Configuration.AddEnvironmentVariables();

if (builder.Environment.IsDevelopment() && string.IsNullOrEmpty(Env.GetString("JWT_KEY")))
{
    throw new InvalidOperationException("JWT Key is not configured.");
}

// --- Read Scalar External API URLs ---
var adminApiUrl =
    Env.GetString("ADMIN_API_URL")
    ?? throw new InvalidOperationException("ADMIN_API_URL not configured");
var webshopApiUrl =
    Env.GetString("WEBSHOP_API_URL")
    ?? throw new InvalidOperationException("WEBSHOP_API_URL not configured");

// --- Service Registrations ---
builder
    .Services.AddApplicationServices(builder.Configuration)
    .AddIdentityServices(builder.Configuration)
    .AddCustomSwagger();

builder.Services.Configure<KeycloakSettings>(builder.Configuration.GetSection("Keycloak"));
builder.Services.AddHttpContextAccessor();
builder.Services.AddControllers();

// --- Host URL Setup ---
if (builder.Environment.IsProduction() || builder.Environment.IsStaging())
{
    builder.WebHost.UseUrls("http://0.0.0.0:9101");
}

// --- Build Application ---
var app = builder.Build();

// --- Database Migration ---
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    try
    {
        var dbContext = services.GetRequiredService<MyDbContext>();
        dbContext.Database.Migrate();
        DbInitializer.Initialize(dbContext);
    }
    catch (Exception ex)
    {
        Console.WriteLine($"An error occurred during database migration: {ex.Message}");
    }
}

// --- Middleware ---
app.UseCustomSwagger(app.Environment.IsDevelopment());

app.MapScalarApiReference(opts =>
{
    opts.WithTitle("Unified API Reference");

    if (!app.Environment.IsDevelopment())
    {
        // Only add servers in staging/production
        opts.AddServer("/platform", "Platform API");
        opts.AddServer("/admin", "Admin API");
        opts.AddServer("/webshop", "Webshop API");
    }

    // Register Documents (always)
    opts.AddDocument("v1", "Platform API");
    opts.AddDocument("admin", "Admin API", adminApiUrl);
    opts.AddDocument("webshop", "Webshop API (Laravel)", webshopApiUrl);
});

if (!app.Environment.IsDevelopment())
{
    app.UseHttpsRedirection();
}

app.UseCustomMiddlewares();
app.UseCors("AllowFrontend");
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

app.Run();
