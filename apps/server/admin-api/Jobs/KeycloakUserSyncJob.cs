// apps/server/platform-api/Jobs/KeycloakUserSyncJob.cs
using EDb.DataAccess.Data;
using EDb.Domain.Entities.Identity;
using EDb.Identity.Abstractions;
using Microsoft.EntityFrameworkCore;

namespace Edb.AdminAPI.Jobs;

public sealed class KeycloakUserSyncJob
{
    private readonly MyDbContext _db;
    private readonly IIdentityGateway _idp;
    private readonly ILogger<KeycloakUserSyncJob> _log;

    public KeycloakUserSyncJob(
        MyDbContext db,
        IIdentityGateway idp,
        ILogger<KeycloakUserSyncJob> log
    )
    {
        _db = db;
        _idp = idp;
        _log = log;
    }

    /// <summary>Nightly full sync. Can also be run manually from Hangfire dashboard.</summary>
    public async Task RunFullSync(CancellationToken ct)
    {
        _log.LogInformation("Keycloak user sync started");

        var seen = new HashSet<string>(StringComparer.OrdinalIgnoreCase);
        string? cursor = null;
        const int pageSize = 500; // tune as needed

        do
        {
            ct.ThrowIfCancellationRequested();

            var page = await _idp.GetUsersAsync(search: null, cursor: cursor, pageSize: pageSize);
            foreach (var u in page.Data)
            {
                seen.Add(u.Id);

                var entity = await _db.KeycloakUsers.FirstOrDefaultAsync(
                    x => x.ExternalId == u.Id,
                    ct
                );

                if (entity is null)
                {
                    entity = new KeycloakUserProjection
                    {
                        ExternalId = u.Id,
                        Username = u.Username,
                        Email = u.Email,
                        FirstName = u.FirstName,
                        LastName = u.LastName,
                        EmailVerified = u.EmailVerified,
                        SyncedAt = DateTimeOffset.UtcNow,
                        LastSeenAt = DateTimeOffset.UtcNow,
                        IsDeleted = false,
                    };
                    _db.KeycloakUsers.Add(entity);
                }
                else
                {
                    entity.Username = u.Username;
                    entity.Email = u.Email;
                    entity.FirstName = u.FirstName;
                    entity.LastName = u.LastName;
                    entity.EmailVerified = u.EmailVerified;
                    entity.SyncedAt = DateTimeOffset.UtcNow;
                    entity.LastSeenAt = DateTimeOffset.UtcNow;
                    entity.IsDeleted = false;
                }
            }

            await _db.SaveChangesAsync(ct);
            cursor = page.NextCursor;
        } while (!ct.IsCancellationRequested && !string.IsNullOrEmpty(cursor));

        // Soft-delete any rows not seen in this run
        var now = DateTimeOffset.UtcNow;
        await _db
            .KeycloakUsers.Where(x => !seen.Contains(x.ExternalId) && !x.IsDeleted)
            .ExecuteUpdateAsync(
                s => s.SetProperty(x => x.IsDeleted, true).SetProperty(x => x.SyncedAt, now),
                ct
            );

        _log.LogInformation("Keycloak user sync finished. Seen={Count}", seen.Count);
    }
}
