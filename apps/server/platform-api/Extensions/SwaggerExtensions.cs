// Edb.PlatformAPI.Extensions.SwaggerExtensions.cs
using Microsoft.OpenApi.Models;

public static class SwaggerExtensions
{
    public static IServiceCollection AddCustomSwagger(this IServiceCollection services)
    {
        services.AddEndpointsApiExplorer();

        services.AddSwaggerGen(c =>
        {
            // Existing SwaggerDocs
            c.SwaggerDoc("v1", new OpenApiInfo { Title = "Platform API", Version = "v1" });
            c.SwaggerDoc("admin", new OpenApiInfo { Title = "Admin API", Version = "v1" });
            c.SwaggerDoc("webshop", new OpenApiInfo { Title = "Webshop API", Version = "v1" });

            // Security Scheme Definition
            c.AddSecurityDefinition(
                "Bearer",
                new OpenApiSecurityScheme
                {
                    Name = "Authorization",
                    Type = SecuritySchemeType.Http,
                    Scheme = "bearer",
                    BearerFormat = "JWT",
                    In = ParameterLocation.Header,
                    Description = "Enter JWT token like: **Bearer {token}**",
                }
            );

            // Force Security Requirement Globally
            c.OperationFilter<GlobalSecurityOperationFilter>();
        });

        return services;
    }

    public static IApplicationBuilder UseCustomSwagger(
        this IApplicationBuilder app,
        bool isDevelopment
    )
    {
        // expose JSON at /openapi/v1.json (Scalar expects this)
        app.UseSwagger(c => c.RouteTemplate = "openapi/{documentName}.json");

        // Optional Swagger UI in dev
        if (isDevelopment)
        {
            app.UseSwaggerUI(ui =>
            {
                ui.SwaggerEndpoint("/openapi/v1.json", "v1");
                ui.RoutePrefix = "swagger";
            });
        }

        return app;
    }
}
