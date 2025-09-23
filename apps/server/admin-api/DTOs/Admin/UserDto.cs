using System.ComponentModel.DataAnnotations;

namespace Edb.AdminAPI.DTOs.Admin;

public class UserDto
{
    public string Id { get; set; } = default!;
    public string Username { get; set; } = default!;
    public string? Email { get; set; } = default!;
    public string? FirstName { get; set; } = default!;
    public string? LastName { get; set; } = default!;
    public bool EmailVerified { get; set; }
}
