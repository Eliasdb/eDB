using System.ComponentModel.DataAnnotations;

namespace api.DTOs.Auth
{
    public class LoginRequest
    {
        [Required]
        public string Email { get; set; } = null!;
        [Required]
        public string Password { get; set; } = null!;
    }
}
