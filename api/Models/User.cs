using System.ComponentModel.DataAnnotations;

namespace api.Models
{
    public class User
    {
        [Key]
        public int Id { get; set; }
        
        [Required]
        [MaxLength(100)]
        public required string Username { get; set; }
        
        [Required]
        public required string Email { get; set; }
        
        // Add additional properties as needed
    }
}
