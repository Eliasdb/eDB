namespace Edb.FeatureAccount.DTOs;

public class AccountUpdateRequest
{
  // public string? Email { get; set; } // locating the user
  // public string? Password { get; set; } // Allow updating password
  // public string? FirstName { get; set; }
  // public string? LastName { get; set; }
  // public string? Country { get; set; }
  // public string? State { get; set; }
  // public string? Company { get; set; }
  // public string? DisplayName { get; set; }
  // public string? PreferredLanguage { get; set; }
  // public string? Title { get; set; }
  // public string? Address { get; set; }

  public string Username { get; set; } = default!;
  public string Email { get; set; } = default!;
  public string FirstName { get; set; } = default!;
  public string LastName { get; set; } = default!;
}
