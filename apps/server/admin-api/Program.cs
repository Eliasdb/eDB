using EDb.AdminAPI.Extensions;

var builder = WebApplication.CreateBuilder(args);

// ─────────────────────────────────────────────────────
// 🏗️ Service Registration
// ─────────────────────────────────────────────────────
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// 📦 Domain / Infrastructure
builder.Services.AddAdminServices(builder.Configuration);

// 🕒 Background Jobs (Hangfire)
builder.Services.AddBackgroundJobs(builder.Configuration, builder.Environment);

// 🌍 Docs CORS (separate from frontend CORS in AdminServices)
builder.Services.AddCors(o =>
    o.AddPolicy(
        "DocsCors",
        p =>
            p.WithOrigins("http://localhost:5098") // docs site origin
                .AllowAnyHeader()
                .AllowAnyMethod()
    )
);

var app = builder.Build();

// ─────────────────────────────────────────────────────
// 🚀 Middleware Pipeline
// ─────────────────────────────────────────────────────

// 🕒 Background Jobs (Dashboard + Recurring Jobs)
app.UseBackgroundJobs(builder.Configuration, builder.Environment);

// 🌍 CORS Policies
app.UseCors("AllowFrontend");
app.UseCors("DocsCors");

// 📖 Swagger / OpenAPI
app.UseSwagger();
app.UseSwaggerUI();

// 🔒 Security
app.UseHttpsRedirection();
app.UseAuthorization();

// 📡 Endpoints (SignalR, Controllers, etc.)
app.MapAdminEndpoints(); // maps SignalR hubs + CORS
app.MapControllers();

// ▶️ Run
app.Run();
