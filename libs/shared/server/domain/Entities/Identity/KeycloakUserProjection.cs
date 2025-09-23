namespace EDb.Domain.Entities.Identity;

public class KeycloakUserProjection
{
    public int Id { get; set; } // your PK
    public string ExternalId { get; set; } = null!; // Keycloak user "id" (UUID) – UNIQUE
    public string? Username { get; set; }
    public string? Email { get; set; }
    public string? FirstName { get; set; }
    public string? LastName { get; set; }
    public bool EmailVerified { get; set; }

    public DateTimeOffset SyncedAt { get; set; } // when this row was last updated
    public DateTimeOffset LastSeenAt { get; set; } // when this user was last observed in KC
    public bool IsDeleted { get; set; } // true if missing in latest sync
}
