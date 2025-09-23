using System.Security.Claims;
using Edb.AdminAPI.DTOs.Notifications;
using EDb.DataAccess.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Edb.AdminAPI.Controllers;

[ApiController]
[Route("signalr/notifications")]
[AllowAnonymous] // keep if JWT is wired; use [AllowAnonymous] during local testing if needed
public class NotificationsController : ControllerBase
{
    private readonly MyDbContext _db;
    private readonly string _singletonUserId;

    public NotificationsController(MyDbContext db, IConfiguration config)
    {
        _db = db;
        _singletonUserId = config["Admin:SingletonUserId"] ?? "singleton-admin";
    }

    // GET /signalr/notifications?limit=50&cursor=<ticks_guid>
    [HttpGet]
    [ProducesResponseType(typeof(PagedNotificationsDto), StatusCodes.Status200OK)]
    public async Task<IActionResult> List(
        [FromQuery] int limit = 50,
        [FromQuery] string? cursor = null,
        CancellationToken ct = default
    )
    {
        var userId = ResolveUserId(); // single-admin id
        var take = Math.Clamp(limit, 1, 200);
        var after = ParseCursor(cursor);

        var baseQuery =
            from r in _db.NotificationRecipients.AsNoTracking()
            join n in _db.Notifications.AsNoTracking() on r.NotificationId equals n.Id
            where r.UserId == userId
            select new { n, r.ReadAt };

        if (after is { } a)
        {
            var afterDt = new DateTime(a.ticks, DateTimeKind.Utc);
            baseQuery = baseQuery.Where(x =>
                x.n.CreatedAt < afterDt
                || (x.n.CreatedAt == afterDt && x.n.Id.CompareTo(a.lastId) < 0)
            );
        }

        var items = await baseQuery
            .OrderByDescending(x => x.n.CreatedAt)
            .ThenByDescending(x => x.n.Id)
            .Take(take + 1)
            .Select(x => new NotificationDto(
                x.n.Id,
                x.n.Type,
                x.n.Severity.ToString(),
                x.n.Title,
                x.n.Message,
                x.n.Href,
                x.n.CreatedAt,
                x.ReadAt != null
            ))
            .ToListAsync(ct);

        string? nextCursor = null;
        if (items.Count > take)
        {
            var last = items[^1];
            nextCursor = MakeCursor(last.CreatedAt, last.Id);
            items.RemoveAt(items.Count - 1);
        }

        var unread = await _db
            .NotificationRecipients.Where(r => r.UserId == userId && r.ReadAt == null)
            .CountAsync(ct);

        return Ok(new PagedNotificationsDto(items, nextCursor, unread));
    }

    // GET /signalr/notifications/unread-count
    [HttpGet("unread-count")]
    public async Task<IActionResult> UnreadCount(CancellationToken ct = default)
    {
        var userId = ResolveUserId();
        var unread = await _db
            .NotificationRecipients.Where(r => r.UserId == userId && r.ReadAt == null)
            .CountAsync(ct);
        return Ok(new { unread });
    }

    // POST /signalr/notifications/{id}/read
    [HttpPost("{id:guid}/read")]
    public async Task<IActionResult> MarkRead([FromRoute] Guid id, CancellationToken ct = default)
    {
        var userId = ResolveUserId();
        var rec = await _db.NotificationRecipients.SingleOrDefaultAsync(
            r => r.NotificationId == id && r.UserId == userId,
            ct
        );
        if (rec is null)
            return NotFound();

        if (rec.ReadAt is null)
        {
            rec.ReadAt = DateTime.UtcNow;
            await _db.SaveChangesAsync(ct);
        }
        return NoContent();
    }

    // POST /signalr/notifications/mark-all-read
    [HttpPost("mark-all-read")]
    public async Task<IActionResult> MarkAllRead(CancellationToken ct = default)
    {
        var userId = ResolveUserId();
        await _db
            .NotificationRecipients.Where(r => r.UserId == userId && r.ReadAt == null)
            .ExecuteUpdateAsync(s => s.SetProperty(r => r.ReadAt, DateTime.UtcNow), ct);
        return NoContent();
    }

    // --- helpers ---

    private string ResolveUserId()
    {
        // If you have JWT, prefer sub; otherwise fall back to the single-admin id.
        return User.FindFirstValue("sub")
            ?? User.FindFirstValue(ClaimTypes.NameIdentifier)
            ?? _singletonUserId;
    }

    private static string MakeCursor(DateTime createdAtUtc, Guid id) =>
        $"{createdAtUtc.Ticks}_{id:N}";

    private static (long ticks, Guid lastId)? ParseCursor(string? cursor)
    {
        if (string.IsNullOrWhiteSpace(cursor))
            return null;
        var parts = cursor.Split('_', 2);
        return (long.TryParse(parts[0], out var t) && Guid.TryParse(parts[1], out var g))
            ? (t, g)
            : ((long, Guid)?)null; // note the extra parentheses
    }
}
