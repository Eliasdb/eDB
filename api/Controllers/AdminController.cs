using api.Attributes;
using api.DTOs.Admin;
using api.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace api.Controllers
{
    public class AdminController(IAdminService adminService) : BaseApiController
    {
        private readonly IAdminService _adminService = adminService;

        [HttpGet("area")]
        [RoleAuthorize("Admin")]
        public IActionResult AdminArea()
        {
            Console.WriteLine("AdminArea endpoint hit");
            return Ok("Welcome, Admin!");
        }

        [HttpGet("users")]
        [RoleAuthorize("Admin")]
        public async Task<IActionResult> GetUsers(
            [FromQuery] object? cursor = null,
            [FromQuery] string sort = "id,asc",
            [FromQuery] string? search = null
        )
        {
            var result = await _adminService.GetUsersAsync(search, cursor, sort);

            return Ok(result);
        }

        [HttpGet("users/{userId}")]
        [RoleAuthorize("Admin")]
        public async Task<IActionResult> GetUserById([FromRoute] int userId)
        {
            var user = await _adminService.GetUserByIdAsync(userId);

            if (user == null)
            {
                return NotFound(new { Message = "User not found." });
            }

            return Ok(user);
        }

        [HttpDelete("users/{userId}")]
        [RoleAuthorize("Admin")]
        public async Task<IActionResult> DeleteUser([FromRoute] int userId)
        {
            var success = await _adminService.DeleteUserAsync(userId);

            if (!success)
            {
                return NotFound(new { Message = "User not found." });
            }

            return Ok(new { Message = "User deleted successfully." });
        }

        [HttpGet("applications")]
        [RoleAuthorize("Admin")]
        public async Task<IActionResult> GetApplications()
        {
            var applications = await _adminService.GetApplicationsAsync();
            return Ok(applications);
        }

        [HttpPost("applications/create")]
        [RoleAuthorize("Admin")]
        public async Task<IActionResult> AddApplication(
            [FromBody] CreateApplicationDto applicationDto
        )
        {
            var application = await _adminService.AddApplicationAsync(applicationDto);
            return Ok(application);
        }

        [HttpPut("applications/{applicationId}")]
        [RoleAuthorize("Admin")]
        public async Task<IActionResult> UpdateApplication(
            [FromRoute] int applicationId,
            [FromBody] UpdateApplicationDto applicationDto
        )
        {
            var updatedApplication = await _adminService.UpdateApplicationAsync(
                applicationId,
                applicationDto
            );

            if (updatedApplication == null)
            {
                return NotFound(new { Message = "Application not found." });
            }

            return Ok(
                new
                {
                    Message = "Application updated successfully.",
                    Application = updatedApplication,
                }
            );
        }

        [HttpDelete("applications/{applicationId}/subscriptions/{userId}")]
        [RoleAuthorize("Admin")]
        public async Task<IActionResult> RevokeSubscription(
            [FromRoute] int applicationId,
            [FromRoute] int userId
        )
        {
            var success = await _adminService.RevokeSubscriptionAsync(applicationId, userId);

            if (!success)
            {
                return NotFound(new { Message = "Subscription not found." });
            }

            return Ok(new { Message = "Subscription revoked successfully." });
        }

        [HttpDelete("applications/{applicationId}")]
        [RoleAuthorize("Admin")]
        public async Task<IActionResult> DeleteApplication([FromRoute] int applicationId)
        {
            var success = await _adminService.DeleteApplicationAsync(applicationId);

            if (!success)
            {
                return NotFound(new { Message = "Application not found." });
            }

            return Ok(new { Message = "Application deleted successfully." });
        }
    }
}
