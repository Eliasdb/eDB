// Models/DTOs/UserDto.cs
using System.ComponentModel.DataAnnotations;

namespace api.DTOs.Admin
{
    public class UserDto
    {
        public int Id { get; set; }

        [Required]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;
        [Required]
        public string FirstName { get; set; } = string.Empty;

        [Required]
        public string LastName { get; set; } = string.Empty;

        [Required]
        public string Country { get; set; } = string.Empty;

        [Required]
        public string State { get; set; } = string.Empty;

        [Required]
        public string Company { get; set; } = string.Empty;

        [Required]
        public string DisplayName { get; set; } = string.Empty;

        // Optional fields
        public string? PreferredLanguage { get; set; }
        public string? Title { get; set; }
        public string? Address { get; set; }
        public string? PhoneNumber { get; set; }

        [Required]
        public string Role { get; set; } = string.Empty;
    }
}
