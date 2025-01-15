using System.Security.Claims;
using api.Data;
using api.DTOs.Profile;
using api.Models;
using AutoMapper;
using Microsoft.EntityFrameworkCore;

namespace api.Services
{
    public class ProfileService(MyDbContext context, IMapper mapper)
    {
        private readonly MyDbContext _context = context;
        private readonly IMapper _mapper = mapper;

        public async Task<User?> GetAuthenticatedUserAsync(ClaimsPrincipal userPrincipal)
        {
            var userIdClaim = userPrincipal.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdClaim))
            {
                return null; // Indicates unauthorized
            }

            int userId = int.Parse(userIdClaim);
            return await _context.Users.FirstOrDefaultAsync(u => u.Id == userId);
        }

        public ProfileSettingsResponse? GetUserProfile(User user)
        {
            return _mapper.Map<ProfileSettingsResponse>(user);
        }

        public async Task UpdateUserProfileAsync(User user, ProfileUpdateRequest request)
        {
            _mapper.Map(request, user); // Update user fields from the request
            await _context.SaveChangesAsync();
        }
    }
}
