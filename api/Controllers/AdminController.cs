using Microsoft.AspNetCore.Mvc;
using api.Data;

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
        }
}
