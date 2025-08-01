// Edb.PlatformAPI.Extensions.SwaggerExtensions.cs
public static class SwaggerExtensions
{
    public static IServiceCollection AddCustomSwagger(this IServiceCollection services)
    {
        services.AddEndpointsApiExplorer();
        services.AddSwaggerGen();
        return services;
    }

    public static IApplicationBuilder UseCustomSwagger(
        this IApplicationBuilder app,
        bool isDevelopment
    )
    {
        // expose JSON at /openapi/v1.json  (Scalar’s default expectation)
        app.UseSwagger(c => c.RouteTemplate = "openapi/{documentName}.json");

        // optional Swagger UI in dev
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
