using System.Security.Claims;
using api.Data;
using api.Interfaces;
using api.Models;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;

namespace api.Services
{
    public class ApplicationsService(MyDbContext context, IMapper mapper) : IApplicationsService
    {
        private readonly MyDbContext _context = context;
        private readonly IMapper _mapper = mapper;

        public int? GetAuthenticatedUserId(ClaimsPrincipal user)
        {
            var userIdClaim = user.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userIdClaim))
            {
                return null;
            }

            return int.TryParse(userIdClaim, out var userId) ? userId : null;
        }

        public async Task<string> ToggleSubscription(int userId, int applicationId)
        {
            var existingSubscription = await _context.Subscriptions.FirstOrDefaultAsync(s =>
                s.UserId == userId && s.ApplicationId == applicationId
            );

            if (existingSubscription != null)
            {
                _context.Subscriptions.Remove(existingSubscription);
                await _context.SaveChangesAsync();
                return "Unsubscribed successfully!";
            }

            var newSubscription = new Subscription
            {
                UserId = userId,
                ApplicationId = applicationId,
                SubscriptionDate = DateTime.UtcNow,
            };

            _context.Subscriptions.Add(newSubscription);
            await _context.SaveChangesAsync();
            return "Subscribed successfully!";
        }

        public async Task<IEnumerable<ApplicationDto>> GetSubscribedApplications(int userId)
        {
            return await _context
                .Subscriptions.Where(ua => ua.UserId == userId)
                .Join(
                    _context.Applications,
                    ua => ua.ApplicationId,
                    app => app.Id,
                    (ua, app) => app
                )
                .ProjectTo<ApplicationDto>(_mapper.ConfigurationProvider)
                .ToListAsync();
        }
    }
}
