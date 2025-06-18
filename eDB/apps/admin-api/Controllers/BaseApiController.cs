using Microsoft.AspNetCore.Mvc;

namespace Edb.AdminAPI.Controllers
{
  [ApiController]
  [Route("api/[controller]")]
  public abstract class BaseApiController : ControllerBase { }
}
