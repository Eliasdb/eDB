using DotNetEnv;
using EDb.DataAccess.Data;
using EDb.FeatureAuth.Extensions;
using Edb.PlatformAPI.Extensions;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// --- Configuration Setup ---
if (builder.Environment.IsDevelopment())
{
  Env.Load();
  builder.Configuration.AddEnvironmentVariables();
  if (string.IsNullOrEmpty(Env.GetString("JWT_KEY")))
  {
    throw new InvalidOperationException("JWT Key is not configured.");
  }
}

// --- Service Registrations ---
// Add modular services from extension methods
builder.Services.AddSession(options =>
{
  options.IdleTimeout = TimeSpan.FromMinutes(30); // Set session timeout
  options.Cookie.HttpOnly = true;
  options.Cookie.IsEssential = true;
});
builder.Services.AddApplicationServices(builder.Configuration); // Custom application services
builder.Services.AddAuthServices(builder.Configuration);

// Add Swagger services
builder.Services.AddSwaggerGen();

// Add controller support
builder.Services.AddControllers();

// Set custom host URL
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
    DbInitializer.Initialize(dbContext); // Seexd database.
  }
  catch (Exception ex)
  {
    Console.WriteLine($"An error occurred during database migration: {ex.Message}");
  }
}

// --- Middleware Configuration ---

if (app.Environment.IsDevelopment())
{
  app.UseSwagger();
  app.UseSwaggerUI();
}
else
{
  app.UseHttpsRedirection();
}

app.UseCors("AllowFrontend");
app.UseSession();

app.UseCustomMiddlewares();

// app.UseSession();

app.UseAuthentication();
app.UseAuthorization();

// app.Use(
//   async (context, next) =>
//   {
//     if (
//       context.Request.Path.StartsWithSegments("/api")
//       && !context.User.Identity?.IsAuthenticated == true
//     )
//     {
//       context.Response.StatusCode = StatusCodes.Status401Unauthorized;
//       return;
//     }
//     await next();
//   }
// );

// Map controllers
app.MapControllers();

// Run the application
app.Run();
