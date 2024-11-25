using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using api.Data;
using System.Threading.Tasks;
using System.Collections.Generic;

namespace api.Controllers
{
    [ApiController]
    [Route("api/admin")]
    public class AdminController : ControllerBase
    {
        private readonly MyDbContext _context;

        public AdminController(MyDbContext context)
        {
            _context = context;
        }

        [HttpGet("area")]
        [RoleAuthorize("Admin")]
        public IActionResult AdminArea()
        {
            Console.WriteLine("AdminArea endpoint hit");
            return Ok("Welcome, Admin!");
        }

        // Updated endpoint to get the list of users with pagination
        [HttpGet("users")]
        [RoleAuthorize("Admin")]
        public async Task<IActionResult> GetUsers(int pageNumber = 1, int pageSize = 15)
        {
            try
            {
                var totalUsers = await _context.Users.CountAsync();

                var users = await _context.Users
                    .Skip((pageNumber - 1) * pageSize)
                    .Take(pageSize)
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
                // Log the exception if needed
                return StatusCode(500, $"An error occurred while retrieving users: {ex.Message}");
            }
        }
    }
}
