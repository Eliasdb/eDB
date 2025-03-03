using System.ComponentModel.DataAnnotations;

namespace EDb.FeatureAuth.DTOs;

public class LoginRequest
{
  [Required]
  public string Email { get; set; } = null!;

  [Required]
  public string Password { get; set; } = null!;
}
