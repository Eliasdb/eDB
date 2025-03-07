using Microsoft.AspNetCore.Mvc;

namespace EDb.FeatureAuth.Controllers
{
  [ApiController]
  [Route("api/[controller]")]
  public abstract class BaseApiController : ControllerBase { }
}
