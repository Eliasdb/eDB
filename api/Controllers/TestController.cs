using Microsoft.AspNetCore.Mvc;

namespace api.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class TestController : ControllerBase
    {
        // GET: /test
        [HttpGet]
        public IActionResult Get()
        {
            return Ok(new { Message = "API is workkingg!", Timestamp = DateTime.UtcNow });
        }
    }
}
