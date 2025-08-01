using Edb.AdminAPI.Extensions;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddAdminServices(builder.Configuration);

builder.Services.AddCors(o =>
    o.AddPolicy(
        "DocsCors",
        p =>
            p.WithOrigins("http://localhost:5098") // ← docs site origin
                .AllowAnyHeader()
                .AllowAnyMethod()
    )
);

var app = builder.Build();

app.UseCors("AllowFrontend");
app.UseCors("DocsCors");

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();
app.MapControllers();
app.Run();
