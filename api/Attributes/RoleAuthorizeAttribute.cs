using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using System.Linq;
using System.Security.Claims;

public class RoleAuthorizeAttribute : Attribute, IAuthorizationFilter
{
    private readonly string[] _roles;

    public RoleAuthorizeAttribute(params string[] roles)
    {
        _roles = roles;
    }

    public void OnAuthorization(AuthorizationFilterContext context)
    {
        var user = context.HttpContext.User;

        if (user?.Identity == null || !user.Identity.IsAuthenticated)
        {
            context.Result = new UnauthorizedResult();
            return;
        }

        var userRoles = user.Claims
            .Where(c => c.Type == ClaimTypes.Role) // Check for ClaimTypes.Role
            .Select(c => c.Value)
            .ToList();

        // Log the roles for debugging
        Console.WriteLine($"User roles: {string.Join(", ", userRoles)}");

        if (!_roles.Any(requiredRole => userRoles.Contains(requiredRole, StringComparer.OrdinalIgnoreCase)))
        {
            context.Result = new ForbidResult();
        }
    }

}


