using api.DTOs.Admin;
using api.Models;

namespace api.Interfaces
{
    public interface IAdminService
    {
        IQueryable<User> BuildUserQuery(
            string? search,
            object? cursor,
            string sortField,
            string sortDirection
        );
        (bool hasMore, object? nextCursor) DetermineNextCursor(
            List<UserDto> users,
            string sortField,
            string sortDirection
        );
        IQueryable<User> ApplySorting(
            IQueryable<User> query,
            string sortField,
            string sortDirection
        );
        (string sortField, string sortDirection) ParseSortParameter(string? sort);
    }
}
