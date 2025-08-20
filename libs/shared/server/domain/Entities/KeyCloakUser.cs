using System.ComponentModel.DataAnnotations.Schema;

[Table("user_entity")]
public class KeycloakUser
{
    public string id { get; set; } = default!;
    public string username { get; set; } = default!;
    public string? email { get; set; } // 👈 Nullable
    public string? first_name { get; set; } // 👈 Nullable
    public string? last_name { get; set; } // 👈 Nullable
    public string realm_id { get; set; } = default!;
    public bool email_verified { get; set; }
}
