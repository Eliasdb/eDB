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
        int pageNumber = 1,
        int pageSize = 15,
        string sortField = "Id", // Default sort field
        string sortDirection = "asc") // Default sort direction
        {
            try
            {
                // Validate input parameters
                pageNumber = Math.Max(pageNumber, 1);
                pageSize = Math.Clamp(pageSize, 1, 100); // Ensures pageSize is between 1 and 100

                // Validate sort direction
                sortDirection = sortDirection.ToLower();
                if (sortDirection != "asc" && sortDirection != "desc")
                {
                    sortDirection = "asc";
                }

                // Get total user count
                var totalUsers = await _context.Users.CountAsync();

                // Apply sorting dynamically
                IQueryable<User> query = _context.Users.AsNoTracking();

                query = ApplySorting(query, sortField, sortDirection);

                // Fetch records for the current page
                var users = await query
                    .Skip((pageNumber - 1) * pageSize)
                    .Take(pageSize)
                    .ProjectTo<UserDto>(_mapper.ConfigurationProvider)
                    .ToListAsync();

                // Check if there are more records beyond the current page
                bool hasMore = (pageNumber * pageSize) < totalUsers;

                // Calculate the actual number of items fetched
                var pagedResult = new DTOs.PagedResult<UserDto>
                {
                    Items = users,
                    HasMore = hasMore && users.Count == pageSize, // No "HasMore" if fewer items fetched
                    PageNumber = pageNumber,
                    PageSize = users.Count, // Use the actual number of items fetched
                    TotalCount = totalUsers
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
                    ApplicationName = app.Name,
                    ApplicationDescription = app.Description,
                    SubscribedUsers = app.Subscriptions
         .Where(sub => sub.User != null) // Ensure User is not null
         .Select(sub => new UserSubscriptionDto
         {
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
