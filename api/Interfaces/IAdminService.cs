using api.DTOs.Admin;
using api.Models;

namespace api.Interfaces
{
    public interface IAdminService
    {
        Task<PagedUserResult<UserDto>> GetUsersAsync(
            string? search,
            string? cursor,
            string sort,
            int pageSize = 15
        );
        Task<UserDto?> GetUserByIdAsync(int userId);
        Task<List<ApplicationOverviewDto>> GetApplicationsWithSubscribersAsync();
        Task<Application> AddApplicationAsync(CreateApplicationDto applicationDto);
        Task<Application?> UpdateApplicationAsync(
            int applicationId,
            UpdateApplicationDto applicationDto
        );
        Task<bool> DeleteUserAsync(int userId);
        Task<bool> DeleteApplicationAsync(int applicationId);
        Task<bool> RevokeSubscriptionAsync(int applicationId, int userId);
    }
}
