using Edb.AdminAPI.DTOs;
using Edb.AdminAPI.Interfaces;
// using EDb.UtilAttributes.Attributes;
// using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Edb.AdminAPI.Controllers
{
    public class AdminController(IAdminService adminService) : BaseApiController
    {
        private readonly IAdminService _adminService = adminService;

        [HttpGet("area")]
        // [Authorize(Policy = "AdminPolicy")]
        public IActionResult AdminArea()
        {
            Console.WriteLine("AdminArea endpoint hit");
            return Ok("Welcome, Admin!");
        }

        [HttpGet("users")]
        // [Authorize(Policy = "AdminPolicy")]
        public async Task<ActionResult<PagedUserResult<UserDto>>> GetUsers(
            [FromQuery] string? cursor = null,
            [FromQuery] string sort = "id,asc",
            [FromQuery] string? search = null
        )
        {
            var result = await _adminService.GetUsersAsync(search, cursor, sort);

            return Ok(result);
        }

        // [HttpGet("users/{userId}")]
        // // [Authorize(Policy = "AdminPolicy")]
        // public async Task<ActionResult<UserDto>> GetUserById([FromRoute] int userId)
        // {
        //   var user = await _adminService.GetUserByIdAsync(userId);

        //   if (user == null)
        //   {
        //     return NotFound(new { Message = "User not found!" });
        //   }

        //   return Ok(user);
        // }

        // [HttpDelete("users/{userId}")]
        // // [Authorize(Policy = "AdminPolicy")]
        // public async Task<IActionResult> DeleteUser([FromRoute] int userId)
        // {
        //   var success = await _adminService.DeleteUserAsync(userId);

        //   if (!success)
        //   {
        //     return NotFound(new ApiResponse { Message = "User not found..." });
        //   }

        //   return Ok(new ApiResponse { Message = "User deleted successfully." });
        // }

        [HttpGet("applications")]
        // [Authorize(Policy = "AdminPolicy")]
        public async Task<
            ActionResult<IEnumerable<ApplicationOverviewDto>>
        > GetApplicationsWithSubscribers()
        {
            var applications = await _adminService.GetApplicationsWithSubscribersAsync();

            return Ok(applications);
        }

        [HttpPost("applications/create")]
        // [Authorize(Policy = "AdminPolicy")]
        public async Task<IActionResult> AddApplication(
            [FromBody] CreateApplicationDto applicationDto
        )
        {
            var application = await _adminService.AddApplicationAsync(applicationDto);

            if (application == null)
            {
                return BadRequest("Unable to create application.");
            }

            // Construct a location URI for the newly created resource.
            // This URI doesn't need to point to a working endpoint right now.
            var locationUri = $"api/applications/{application.Id}";

            // Return a 201 Created response, including the Location header and the created application.
            return Created(locationUri, application);
        }

        [HttpPut("applications/{applicationId}")]
        // [Authorize(Policy = "AdminPolicy")]
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
                return NotFound(new ApiResponse { Message = "Application not found." });
            }

            return Ok(
                new
                {
                    Message = "Application updated successfully.",
                    Application = updatedApplication,
                }
            );
        }

        // [HttpDelete("applications/{applicationId}/subscriptions/{userId}")]
        // // [Authorize(Policy = "AdminPolicy")]
        // public async Task<IActionResult> RevokeSubscription(
        //   [FromRoute] int applicationId,
        //   [FromRoute] int userId
        // )
        // {
        //   var success = await _adminService.RevokeSubscriptionAsync(applicationId, userId);

        //   if (!success)
        //   {
        //     return NotFound(new { Message = "Subscription not found." });
        //   }

        //   return Ok(new { Message = "Subscription revoked successfully." });
        // }

        [HttpDelete("applications/{applicationId}")]
        // [Authorize(Policy = "AdminPolicy")]
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
