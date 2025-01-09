using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using api.Data;
using api.DTOs.Applications;

[ApiController]
[Route("api/[controller]")]
public class ApplicationsController : ControllerBase
{
    private readonly MyDbContext _context;

    public ApplicationsController(MyDbContext context)
    {
        _context = context;
    }

    // GET: api/applications
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Application>>> GetApplications()
    {
        return await _context.Applications.ToListAsync();
    }

    // POST: api/applications/subscribe

    [HttpPost("subscribe")]
    public async Task<IActionResult> SubscribeToApplication([FromBody] SubscribeRequest request)
    {
        var applicationId = request.ApplicationId;
        var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(userIdClaim))
        {
            return Unauthorized(new { message = "User is not authenticated." });
        }

        var userId = int.Parse(userIdClaim);

        var existingSubscription = await _context.Subscriptions
            .FirstOrDefaultAsync(ua => ua.UserId == userId && ua.ApplicationId == applicationId);

        if (existingSubscription != null)
        {
            _context.Subscriptions.Remove(existingSubscription);
            await _context.SaveChangesAsync();
            return Ok(new { message = "Unsubscribed successfully!" });
        }

        var userApplication = new Subscription
        {
            UserId = userId,
            ApplicationId = applicationId,
            SubscriptionDate = DateTime.UtcNow
        };

        _context.Subscriptions.Add(userApplication);
        await _context.SaveChangesAsync();
        return Ok(new { message = "Subscribed successfully" });
    }

    // GET: api/applications/user
    [HttpGet("user")]
    public async Task<ActionResult<IEnumerable<Application>>> GetUserApplications()
    {
        // Extract the userId from JWT claims
        var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(userIdClaim))
        {
            return Unauthorized(new { message = "User is not authenticated!" });
        }

        var userId = int.Parse(userIdClaim);

        // Get the subscribed applications for the user
        var subscribedApplications = await _context.Subscriptions
            .Where(ua => ua.UserId == userId)
            .Join(_context.Applications,
                ua => ua.ApplicationId,
                app => app.Id,
                (ua, app) => app)
            .ToListAsync();

        return subscribedApplications;
    }
}
