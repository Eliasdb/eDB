namespace EDb.Domain.Entities;

public class Subscription
{
  public int Id { get; set; }
  public required string KeycloakUserId { get; set; } // Keycloak's unique identifier
  public int ApplicationId { get; set; } // Foreign key to the Application
  public DateTime SubscriptionDate { get; set; }

  // Navigation Property for Application only; local user is not maintained
  public Application? Application { get; set; }
}
