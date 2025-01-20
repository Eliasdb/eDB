using System.Security.Claims;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;

namespace PlatformAPI.Attributes
{
    [AttributeUsage(AttributeTargets.All)]
    public class RoleAuthorizeAttribute(params string[] roles) : Attribute, IAuthorizationFilter
    {
        private readonly string[] _roles = roles;

        public void OnAuthorization(AuthorizationFilterContext context)
        {
            var user = context.HttpContext.User;

            if (user?.Identity == null || !user.Identity.IsAuthenticated)
            {
                context.Result = new UnauthorizedResult();
                return;
            }

            var userRoles = user
                .Claims.Where(c => c.Type == ClaimTypes.Role) // Check for ClaimTypes.Role
                .Select(c => c.Value)
                .ToList();

            Console.WriteLine($"User roles: {string.Join(", ", userRoles)}");

            if (
                !_roles.Any(requiredRole =>
                    userRoles.Contains(requiredRole, StringComparer.OrdinalIgnoreCase)
                )
            )
            {
                context.Result = new ForbidResult();
            }
        }
    }
}
