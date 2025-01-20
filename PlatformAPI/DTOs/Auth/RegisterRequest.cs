using System.ComponentModel.DataAnnotations;

namespace PlatformAPI.DTOs.Auth;

public class RegisterRequest
{
    [Required]
    [EmailAddress]
    public string Email { get; set; } = null!; // Ensure non-nullable with default value

    [Required]
    [MinLength(8)]
    public string Password { get; set; } = null!;

    [Required]
    public string FirstName { get; set; } = null!;

    [Required]
    public string LastName { get; set; } = null!;

    [Required]
    public string Country { get; set; } = null!;

    [Required]
    public string State { get; set; } = null!;

    [Required]
    public string Company { get; set; } = null!;
}
