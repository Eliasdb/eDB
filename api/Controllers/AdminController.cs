// Controllers/AdminController.cs

using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using api.Data;
using AutoMapper;
using api.Models;
using AutoMapper.QueryableExtensions;
using System.Linq.Dynamic.Core;
using api.DTOs;

namespace api.Controllers
{
    [ApiController]
    [Route("api/admin")]
    public class AdminController : ControllerBase
    {
        private readonly MyDbContext _context;
        private readonly IMapper _mapper;

        public AdminController(MyDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        [HttpGet("area")]
        [RoleAuthorize("Admin")]
        public IActionResult AdminArea()
        {
            Console.WriteLine("AdminArea endpoint hit");
            return Ok("Welcome, Admin!");
        }

        // Endpoint to get the list of users with pagination and sorting using AutoMapper
        [HttpGet("users")]
        [RoleAuthorize("Admin")]
        public async Task<IActionResult> GetUsers(
           [FromQuery] int page = 1,
           [FromQuery] int size = 15,
           [FromQuery] string? sort = "id,asc", // Default sort syntax
           [FromQuery] string? search = null)  // Optional search query
        {
            try
            {
                // Validate input parameters
                page = Math.Max(page, 1);
                size = Math.Clamp(size, 1, 100); // Ensure size is between 1 and 100

                // Parse sort parameter
                var sortParams = ParseSortParameter(sort);
                var sortField = sortParams.Item1;
                var sortDirection = sortParams.Item2;

                // Get total user count before filtering
                var totalUsers = await _context.Users.CountAsync();

                // Apply filtering and sorting dynamically
                IQueryable<User> query = _context.Users.AsNoTracking();

                if (!string.IsNullOrWhiteSpace(search))
                {
                    // Apply search filter
                    search = search.ToLower();
                    query = query.Where(u =>
                        (u.FirstName != null && u.FirstName.ToLower().Contains(search)) ||
                        (u.LastName != null && u.LastName.ToLower().Contains(search)) ||
                        (u.Email != null && u.Email.ToLower().Contains(search)));
                }

                // Apply sorting dynamically
                query = ApplySorting(query, sortField, sortDirection);

                // Get filtered count
                var filteredCount = await query.CountAsync();

                // Fetch records for the current page
                var users = await query
                    .Skip((page - 1) * size)
                    .Take(size)
                    .ProjectTo<UserDto>(_mapper.ConfigurationProvider)
                    .ToListAsync();

                // Check if there are more records beyond the current page
                bool hasMore = (page * size) < filteredCount;

                // Construct the paged result
                var pagedResult = new DTOs.PagedResult<UserDto>
                {
                    Items = users,
                    HasMore = hasMore && users.Count == size,
                    PageNumber = page,
                    PageSize = users.Count,
                    TotalCount = filteredCount // Use the filtered count here
                };

                return Ok(pagedResult);
            }
            catch (Exception ex)
            {
                // Log the exception details
                Console.Error.WriteLine($"Error in GetUsers: {ex.Message}");
                return StatusCode(500, "An error occurred while retrieving users.");
            }
        }

        // Helper method to parse the "sort" parameter
        private (string, string) ParseSortParameter(string? sort)
        {
            if (string.IsNullOrWhiteSpace(sort))
            {
                return ("Id", "asc"); // Default sorting
            }

            var sortParts = sort.Split(',');
            var sortField = sortParts.Length > 0 ? sortParts[0] : "Id";
            var sortDirection = sortParts.Length > 1 ? sortParts[1].ToLower() : "asc";

            // Validate sort direction
            if (sortDirection != "asc" && sortDirection != "desc")
            {
                sortDirection = "asc"; // Default to ascending
            }

            return (sortField, sortDirection);
        }

        [HttpGet("applications-overview")]
        [RoleAuthorize("Admin")]
        public async Task<IActionResult> GetApplicationsOverview()
        {
            try
            {
                // Fetch all applications with their subscriptions
                var applications = await _context.Applications
                    .Include(a => a.Subscriptions)
                        .ThenInclude(s => s.User) // Include users for subscriptions
                    .AsNoTracking()
                    .ToListAsync();

                // Map to ApplicationOverviewDto
                var applicationOverviews = applications.Select(app => new ApplicationOverviewDto
                {
                    ApplicationId = app.Id, // Populate ApplicationId
                    ApplicationName = app.Name,
                    ApplicationDescription = app.Description,
                    SubscribedUsers = app.Subscriptions
                        .Where(sub => sub.User != null) // Ensure User is not null
                        .Select(sub => new UserSubscriptionDto
                        {
                            UserId = sub.UserId, // Populate UserId
                            UserName = sub.User != null ? $"{sub.User.FirstName} {sub.User.LastName}" : "Unknown User",
                            UserEmail = sub.User?.Email ?? "No Email",
                            SubscriptionDate = sub.SubscriptionDate
                        }).ToList()
                }).ToList();

                return Ok(applicationOverviews);
            }
            catch (Exception ex)
            {
                // Log the exception
                Console.Error.WriteLine($"Error in GetApplicationsOverview: {ex.Message}");
                return StatusCode(500, "An error occurred while retrieving application overviews.");
            }
        }


        [HttpPost("applications/create")]
        [RoleAuthorize("Admin")]
        public async Task<IActionResult> AddApplication([FromBody] CreateApplicationDto applicationDto)
        {
            try
            {
                var application = new Application
                {
                    Name = applicationDto.Name,
                    Description = applicationDto.Description,
                    IconUrl = applicationDto.IconUrl,
                    RoutePath = applicationDto.RoutePath
                };

                _context.Applications.Add(application);
                await _context.SaveChangesAsync();

                return Ok(application);
            }
            catch (Exception ex)
            {
                Console.Error.WriteLine($"Error in AddApplication: {ex.Message}");
                return StatusCode(500, "An error occurred while adding the application.");
            }
        }

        [HttpDelete("applications/{applicationId}/subscriptions/{userId}")]
        [RoleAuthorize("Admin")]
        public async Task<IActionResult> RevokeSubscriptionByUserAndApplication(
           [FromRoute] int applicationId,
           [FromRoute] int userId)
        {
            try
            {
                // Fetch the subscription record based on applicationId and userId
                var subscription = await _context.Subscriptions
                    .FirstOrDefaultAsync(s => s.ApplicationId == applicationId && s.UserId == userId);

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
            catch (Exception ex)
            {
                // Log error and return server error response
                Console.Error.WriteLine($"Error in RevokeSubscriptionByUserAndApplication: {ex.Message}");
                return StatusCode(500, new { Message = "An error occurred while revoking the subscription." });
            }
        }




        /// <summary>
        /// Applies dynamic sorting to the user query based on the provided sort field and direction.
        /// </summary>
        /// <param name="query">The IQueryable of Users.</param>
        /// <param name="sortField">The field to sort by.</param>
        /// <param name="sortDirection">The direction of sorting: "asc" or "desc".</param>
        /// <returns>The sorted IQueryable of Users.</returns>
        static IQueryable<User> ApplySorting(IQueryable<User> query, string sortField, string sortDirection)
        {
            // Define allowed sort fields for Users
            var allowedSortFields = new List<string> { "Id", "FirstName", "LastName", "Email", "Role", "State" };

            if (!allowedSortFields.Contains(sortField, StringComparer.OrdinalIgnoreCase))
            {
                sortField = "Id"; // Fallback to default sort field
            }

            // Apply sorting dynamically using System.Linq.Dynamic.Core
            var sorting = $"{sortField} {sortDirection}";
            return query.OrderBy(sorting);
        }

        static IQueryable<Subscription> ApplySorting(IQueryable<Subscription> query, string sortField, string sortDirection)
        {
            var allowedSortFields = new List<string>
            {
                "SubscriptionDate",
                "User.FirstName",
                "User.LastName",
                "User.Email",
                "Application.Name",
                "Application.Description"
            };

            if (!allowedSortFields.Contains(sortField, StringComparer.OrdinalIgnoreCase))
            {
                sortField = "SubscriptionDate"; // Default sort field
            }

            var sorting = $"{sortField} {sortDirection}";
            return query.OrderBy(sorting);
        }




    }
}
