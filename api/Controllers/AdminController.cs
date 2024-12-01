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
        /// <summary>
        /// Endpoint to get the list of users with cursor-based pagination, sorting, and search.
        /// </summary>
        [HttpGet("users")]
        [RoleAuthorize("Admin")]
        public async Task<IActionResult> GetUsers(
           [FromQuery] string? cursor = null, // Cursor for pagination
           [FromQuery] string? sort = "id,asc", // Sort syntax
           [FromQuery] string? search = null) // Optional search query
        {
            try
            {
                // Parse sort parameter
                var sortParams = ParseSortParameter(sort);
                var sortField = sortParams.Item1;
                var sortDirection = sortParams.Item2;

                // Build base query
                IQueryable<User> query = _context.Users.AsNoTracking();

                // Apply search filter
                if (!string.IsNullOrWhiteSpace(search))
                {
                    search = search.ToLower();
                    query = query.Where(u =>
                        (u.FirstName != null && u.FirstName.ToLower().Contains(search)) ||
                        (u.LastName != null && u.LastName.ToLower().Contains(search)) ||
                        (u.Email != null && u.Email.ToLower().Contains(search)));
                }

                // Apply cursor-based pagination
                if (!string.IsNullOrWhiteSpace(cursor))
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

                // Apply sorting
                query = ApplySorting(query, sortField, sortDirection);

                // Fetch the next 15 records
                var users = await query
                    .Take(15)
                    .ProjectTo<UserDto>(_mapper.ConfigurationProvider)
                    .ToListAsync();

                // Determine next cursor
                var hasMore = users.Count == 15;
                var nextCursor = hasMore ? (sortDirection == "asc" ? users.Last() : users.First())?.GetType()
                    .GetProperty(sortField)
                    ?.GetValue(users.LastOrDefault()) : null;

                // Construct response
                var result = new
                {
                    Data = users,
                    NextCursor = nextCursor,
                    HasMore = hasMore
                };

                return Ok(result);
            }
            catch (Exception ex)
            {
                // Log the full exception
                Console.Error.WriteLine($"Error in GetUsers: {ex.Message}");
                Console.Error.WriteLine($"Stack Trace: {ex.StackTrace}");
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
        { "id", "Id" }
    };

            if (!fieldMapping.TryGetValue(sortField, out var mappedField))
            {
                Console.WriteLine($"Invalid sort field: {sortField}. Defaulting to Id.");
                mappedField = "Id"; // Default to Id if field is invalid
            }

            // Validate sort direction
            if (sortDirection != "asc" && sortDirection != "desc")
            {
                sortDirection = "asc"; // Default to ascending
            }

            return (mappedField, sortDirection);
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
                    RoutePath = applicationDto.RoutePath,
                    Tags = applicationDto.Tags
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

        [HttpDelete("applications/{applicationId}")]
        [RoleAuthorize("Admin")]
        public async Task<IActionResult> DeleteApplication([FromRoute] int applicationId)
        {
            try
            {
                // Fetch the application based on the provided applicationId
                var application = await _context.Applications
                    .FirstOrDefaultAsync(a => a.Id == applicationId);

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
            catch (Exception ex)
            {
                // Log the error and return a server error response
                Console.Error.WriteLine($"Error in DeleteApplication: {ex.Message}");
                return StatusCode(500, new { Message = "An error occurred while deleting the application." });
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
            // Define allowed sort fields
            var allowedSortFields = new List<string> { "Id", "FirstName", "LastName", "Email", "Role", "State" };

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
