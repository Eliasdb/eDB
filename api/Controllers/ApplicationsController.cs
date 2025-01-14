using api.Attributes;
using api.Data;
using api.DTOs.Applications;
using api.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ApplicationsController(
        MyDbContext context,
        IMapper mapper,
        ISubscriptionService subscriptionService
    ) : ControllerBase
    {
        private readonly MyDbContext _context = context;
        private readonly IMapper _mapper = mapper;
        private readonly ISubscriptionService _subscriptionService = subscriptionService;

        [HttpGet]
        [RoleAuthorize("User")]
        public async Task<ActionResult<IEnumerable<ApplicationDto>>> GetApplications()
        {
            var applications = await _context
                .Applications.ProjectTo<ApplicationDto>(_mapper.ConfigurationProvider)
                .ToListAsync();

            return Ok(applications);
        }

        [HttpPost("subscribe")]
        [RoleAuthorize("User")]
        public async Task<IActionResult> SubscribeToApplication([FromBody] SubscribeRequest request)
        {
            var userId = _subscriptionService.GetAuthenticatedUserId(User);
            if (userId == null)
            {
                return Unauthorized(new { message = "User is not authenticated." });
            }

            var result = await _subscriptionService.ToggleSubscription(
                userId.Value,
                request.ApplicationId
            );
            return Ok(new { message = result });
        }

        [HttpGet("user")]
        [RoleAuthorize("User")]
        public async Task<ActionResult<IEnumerable<ApplicationDto>>> GetUserApplications()
        {
            var userId = _subscriptionService.GetAuthenticatedUserId(User);
            if (userId == null)
            {
                return Unauthorized(new { message = "User is not authenticated!" });
            }

            var subscribedApplications = await _subscriptionService.GetSubscribedApplications(
                userId.Value
            );

            return Ok(subscribedApplications);
        }
    }
}
