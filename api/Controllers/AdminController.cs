// Controllers/AdminController.cs
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using api.Data;
using api.Models.DTOs;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using System.Linq.Dynamic.Core;
using api.Models; // Required for dynamic LINQ queries

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

                var users = await query
                    .Skip((pageNumber - 1) * pageSize)
                    .Take(pageSize)
                    .ProjectTo<UserDto>(_mapper.ConfigurationProvider)
                    .ToListAsync();

                bool hasMore = (pageNumber * pageSize) < totalUsers;

                var result = new
                {
                    Items = users,
                    HasMore = hasMore
                };

                return Ok(result);
            }
            catch (Exception ex)
            {
                // Log the exception details
                Console.Error.WriteLine($"Error in GetUsers: {ex.Message}");
                return StatusCode(500, "An error occurred while retrieving users.");
            }
        }

        /// <summary>
        /// Applies dynamic sorting to the user query based on the provided sort field and direction.
        /// </summary>
        /// <param name="query">The IQueryable of Users.</param>
        /// <param name="sortField">The field to sort by.</param>
        /// <param name="sortDirection">The direction of sorting: "asc" or "desc".</param>
        /// <returns>The sorted IQueryable of Users.</returns>
        private IQueryable<User> ApplySorting(IQueryable<User> query, string sortField, string sortDirection)
        {
            // Define allowed sort fields to prevent SQL injection
            var allowedSortFields = new List<string> { "Id", "FirstName", "LastName", "Email", "Role", "State" };

            if (!allowedSortFields.Contains(sortField, StringComparer.OrdinalIgnoreCase))
            {
                sortField = "Id"; // Fallback to default if invalid sort field
            }

            // Apply sorting using System.Linq.Dynamic.Core for dynamic queries
            var sorting = $"{sortField} {sortDirection}";
            return query.OrderBy(sorting);
        }
    }
}
