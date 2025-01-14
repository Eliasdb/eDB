using System.Linq.Dynamic.Core;
using api.Attributes;
using api.Data;
using api.DTOs.Admin;
using api.Interfaces;
using api.Models;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace api.Controllers
{
    [ApiController]
    [Route("api/admin")]
    public class AdminController(
        MyDbContext context,
        IMapper mapper,
        IUserQueryService userQueryService
    ) : ControllerBase
    {
        private readonly MyDbContext _context = context;
        private readonly IMapper _mapper = mapper;
        private readonly IUserQueryService _userQueryService = userQueryService;

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
            [FromQuery] string? sort = "id,asc",
            [FromQuery] string? search = null
        )
        {
            // Parse sorting parameters
            var (sortField, sortDirection) = _userQueryService.ParseSortParameter(sort);

            // Build and configure the base query for users
            IQueryable<User> query = _userQueryService.BuildUserQuery(
                search,
                cursor,
                sortField,
                sortDirection
            );

            // Apply dynamic sorting
            query = _userQueryService.ApplySorting(query, sortField, sortDirection);

            // Fetch the next set of users
            var users = await query
                .Take(15)
                .ProjectTo<UserDto>(_mapper.ConfigurationProvider)
                .ToListAsync();

            // Determine pagination details
            var (hasMore, nextCursor) = _userQueryService.DetermineNextCursor(
                users,
                sortField,
                sortDirection
            );

            // Construct and return the paged result
            var result = new PagedUserResult<UserDto>
            {
                Data = users,
                NextCursor = nextCursor,
                HasMore = hasMore,
            };

            return Ok(result);
        }

        [HttpGet("users/{userId}")]
        [RoleAuthorize("Admin")]
        public async Task<IActionResult> GetUserById([FromRoute] int userId)
        {
            // Fetch the user based on userId
            var user = await _context
                .Users.AsNoTracking()
                .Where(u => u.Id == userId)
                .ProjectTo<UserDto>(_mapper.ConfigurationProvider)
                .FirstOrDefaultAsync();

            // Check if user exists
            if (user == null)
            {
                return NotFound(new { Message = "User not found." });
            }

            // Return the user details
            return Ok(user);
        }

        [HttpDelete("users/{userId}")]
        [RoleAuthorize("Admin")]
        public async Task<IActionResult> DeleteUser([FromRoute] int userId)
        {
            // Fetch the user based on the provided userId
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == userId);

            // If the user is not found, return a 404 response
            if (user == null)
            {
                return NotFound(new { Message = "User not found." });
            }

            // Remove the user from the database
            _context.Users.Remove(user);
            await _context.SaveChangesAsync();

            return Ok(new { Message = "User deleted successfully." });
        }

        [HttpGet("applications")]
        [RoleAuthorize("Admin")]
        public async Task<IActionResult> GetApplications()
        {
            var applications = await _context
                .Applications.Include(a => a.Subscriptions)
                .ThenInclude(s => s.User)
                .AsNoTracking()
                .ProjectTo<ApplicationOverviewDto>(_mapper.ConfigurationProvider)
                .ToListAsync();

            return Ok(applications);
        }

        [HttpPost("applications/create")]
        [RoleAuthorize("Admin")]
        public async Task<IActionResult> AddApplication(
            [FromBody] CreateApplicationDto applicationDto
        )
        {
            // Use AutoMapper to map the DTO to an Application entity
            var application = _mapper.Map<Application>(applicationDto);

            _context.Applications.Add(application);
            await _context.SaveChangesAsync();

            // Optionally map to a response DTO or return the application entity as needed
            return Ok(application);
        }

        [HttpPut("applications/{applicationId}")]
        [RoleAuthorize("Admin")]
        public async Task<IActionResult> UpdateApplication(
            [FromRoute] int applicationId,
            [FromBody] UpdateApplicationDto applicationDto
        )
        {
            // Fetch the application based on the provided applicationId
            var application = await _context.Applications.FirstOrDefaultAsync(a =>
                a.Id == applicationId
            );

            // If the application is not found, return a 404 response
            if (application == null)
            {
                return NotFound(new { Message = "Application not found." });
            }

            // Use AutoMapper to update the entity
            _mapper.Map(applicationDto, application);

            // Save changes to the database
            await _context.SaveChangesAsync();

            // Return a success response with the updated application
            return Ok(
                new { Message = "Application updated successfully.", Application = application }
            );
        }

        [HttpDelete("applications/{applicationId}/subscriptions/{userId}")]
        [RoleAuthorize("Admin")]
        public async Task<IActionResult> RevokeSubscription(
            [FromRoute] int applicationId,
            [FromRoute] int userId
        )
        {
            // Fetch the subscription record based on applicationId and userId
            var subscription = await _context.Subscriptions.FirstOrDefaultAsync(s =>
                s.ApplicationId == applicationId && s.UserId == userId
            );

            // If no matching subscription is found, return 404
            if (subscription == null)
            {
                return NotFound(new { Message = "Subscription not found." });
            }

            // Remove the subscription record
            _context.Subscriptions.Remove(subscription);
            await _context.SaveChangesAsync();

            // Return success response
            return Ok(new { Message = "Subscription revoked successfully." });
        }

        [HttpDelete("applications/{applicationId}")]
        [RoleAuthorize("Admin")]
        public async Task<IActionResult> DeleteApplication([FromRoute] int applicationId)
        {
            // Fetch the application based on the provided applicationId
            var application = await _context.Applications.FirstOrDefaultAsync(a =>
                a.Id == applicationId
            );

            // If the application is not found, return a 404 response
            if (application == null)
            {
                return NotFound(new { Message = "Application not found." });
            }

            // Remove the application from the database
            _context.Applications.Remove(application);
            await _context.SaveChangesAsync();

            // Return a success response
            return Ok(new { Message = "Application deleted successfully." });
        }
    }
}
