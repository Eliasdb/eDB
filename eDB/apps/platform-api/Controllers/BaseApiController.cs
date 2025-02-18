using Microsoft.AspNetCore.Mvc;

namespace Edb.PlatformAPI.Controllers
{
  [ApiController]
  [Route("api/[controller]")]
  public abstract class BaseApiController : ControllerBase { }
}
