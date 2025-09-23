// libs/shared/server/identity/Abstractions/Models.cs
namespace EDb.Identity.Abstractions;

public sealed record UpdateUserCommand(string FirstName, string LastName, string Email);

public sealed record ApplicationInfo(
    string ClientId,
    string Name,
    string Url,
    string Type,
    string Status
);

public sealed record UserProfileConfig(IReadOnlyList<UserProfileAttribute> Attributes);

public sealed record UserProfileAttribute(
    string Name,
    string DisplayName,
    IReadOnlyList<string> ViewRoles,
    IReadOnlyList<string> EditRoles,
    string InputType,
    IReadOnlyList<string> VisibleInForms
);

public sealed record PagedResult<T>(IReadOnlyList<T> Data, string? NextCursor, bool HasMore);

public sealed record IdpUser(
    string Id,
    string? Username,
    string? Email,
    string? FirstName,
    string? LastName,
    bool EmailVerified
);
