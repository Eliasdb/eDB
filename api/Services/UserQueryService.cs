using System.Linq.Dynamic.Core;
using api.Data;
using api.DTOs.Admin;
using api.Interfaces;
using api.Models;
using Microsoft.EntityFrameworkCore;

namespace api.Services
{
    public class UserQueryService(MyDbContext context) : IUserQueryService
    {
        private readonly MyDbContext _context = context;

        public IQueryable<User> BuildUserQuery(
            string? search,
            object? cursor,
            string sortField,
            string sortDirection
        )
        {
            IQueryable<User> query = _context.Users.AsNoTracking();

            // Apply search filter if provided for first name, last name and email
            if (!string.IsNullOrWhiteSpace(search))
            {
                var pattern = $"%{search}%";
                query = query.Where(u =>
                    (u.FirstName != null && EF.Functions.Like(u.FirstName, pattern))
                    || (u.LastName != null && EF.Functions.Like(u.LastName, pattern))
                    || (u.Email != null && EF.Functions.Like(u.Email, pattern))
                );
            }

            // Apply cursor-based pagination logic
            if (cursor is string cursorStr && !string.IsNullOrWhiteSpace(cursorStr))
            {
                if (sortDirection == "asc")
                {
                    query = query.Where($"{sortField} > @0", cursor);
                }
                else
                {
                    query = query.Where($"{sortField} < @0", cursor);
                }
            }

            return query;
        }

        public (bool hasMore, object? nextCursor) DetermineNextCursor(
            List<UserDto> users,
            string sortField,
            string sortDirection
        )
        {
            var hasMore = users.Count == 15;
            object? nextCursor = null;

            if (hasMore)
            {
                // Choose the last or first user based on sort direction
                var referenceUser = sortDirection == "asc" ? users.Last() : users.First();
                nextCursor = referenceUser
                    ?.GetType()
                    .GetProperty(sortField)
                    ?.GetValue(referenceUser);
            }

            return (hasMore, nextCursor);
        }

        public IQueryable<User> ApplySorting(
            IQueryable<User> query,
            string sortField,
            string sortDirection
        )
        {
            // Define allowed sort fields
            var allowedSortFields = new List<string>
            {
                "Id",
                "FirstName",
                "LastName",
                "Email",
                "Role",
                "State",
            };

            if (!allowedSortFields.Contains(sortField, StringComparer.OrdinalIgnoreCase))
            {
                Console.WriteLine($"Invalid sort field: {sortField}. Defaulting to Id.");
                sortField = "Id"; // Default to Id if field is invalid
            }

            // Apply sorting dynamically using System.Linq.Dynamic.Core
            var sorting = $"{sortField} {sortDirection}";
            Console.WriteLine($"Applying sorting: {sorting}");
            return query.OrderBy(sorting);
        }

        public (string sortField, string sortDirection) ParseSortParameter(string? sort)
        {
            if (string.IsNullOrWhiteSpace(sort))
            {
                return ("Id", "asc"); // Default sorting
            }

            var sortParts = sort.Split(',');
            var sortField = sortParts.Length > 0 ? sortParts[0] : "id";
            var sortDirection = sortParts.Length > 1 ? sortParts[1].ToLower() : "asc";

            // Map camelCase to PascalCase database fields
            var fieldMapping = new Dictionary<string, string>(StringComparer.OrdinalIgnoreCase)
            {
                { "firstName", "FirstName" },
                { "lastName", "LastName" },
                { "email", "Email" },
                { "role", "Role" },
                { "state", "State" },
                { "id", "Id" },
            };

            if (!fieldMapping.TryGetValue(sortField, out var mappedField))
            {
                Console.WriteLine($"Invalid sort field: {sortField}. Defaulting to Id.");
                mappedField = "Id"; // Default to Id if field is invalid
            }

            // Validate sort direction
            if (sortDirection != "asc" && sortDirection != "desc")
            {
                sortDirection = "asc";
            }

            return (mappedField, sortDirection);
        }
    }
}
