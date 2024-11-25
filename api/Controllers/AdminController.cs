// Controllers/AdminController.cs
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using api.Data;
using api.Models.DTOs;
using AutoMapper;
using AutoMapper.QueryableExtensions;

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

        // Endpoint to get the list of users with pagination using AutoMapper
        [HttpGet("users")]
        [RoleAuthorize("Admin")]
        public async Task<IActionResult> GetUsers(int pageNumber = 1, int pageSize = 15)
        {
            try
            {
                // Validate input parameters
                if (pageNumber < 1) pageNumber = 1;
                if (pageSize < 1) pageSize = 15;
                if (pageSize > 100) pageSize = 100; // Maximum page size limit

                var totalUsers = await _context.Users.CountAsync();

                var users = await _context.Users
                    .AsNoTracking() // Improves performance for read-only queries
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
                // Log the exception details (implementation depends on your logging setup)
                Console.Error.WriteLine($"Error in GetUsers: {ex.Message}");
                return StatusCode(500, "An error occurred while retrieving users.");
            }
        }
    }
}
