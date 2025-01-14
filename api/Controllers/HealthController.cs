using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Diagnostics.HealthChecks;

[ApiController]
[Route("[controller]")]
public class HealthController(HealthCheckService healthCheckService) : ControllerBase
{
    private readonly HealthCheckService _healthCheckService = healthCheckService;

    [HttpGet("/health")]
    public async Task<IActionResult> Get()
    {
        var report = await _healthCheckService.CheckHealthAsync();

        var response = new
        {
            status = report.Status.ToString(),
            checks = report.Entries.Select(entry => new
            {
                name = entry.Key,
                status = entry.Value.Status.ToString(),
                description = entry.Value.Description,
            }),
            totalDuration = report.TotalDuration,
        };

        return Ok(response);
    }
}
