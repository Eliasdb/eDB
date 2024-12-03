using Microsoft.AspNetCore.Mvc;
using api.Data;
using api.DTOs;
using api.Models;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace api.Controllers
{
    [ApiController]
    [Route("api/profile")]
    [RoleAuthorize("User", "Admin")]

    public class ProfileController : ControllerBase
    {
        private readonly MyDbContext _context;

        public ProfileController(MyDbContext context)
        {
            _context = context;
        }

        [HttpGet("settings")]
        public async Task<IActionResult> GetProfileSettings()
        {
            var userIdClaim = HttpContext.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdClaim))
            {
                return Unauthorized(new
                {
                    error = "Unauthorized",
                    message = "User not authenticated"
                });
            }

            int userId = int.Parse(userIdClaim);
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == userId);

            if (user == null)
            {
                return NotFound(new
                {
                    error = "NotFound",
                    message = "User not found"
                });
            }

            return Ok(new
            {
                user.Email,
                user.FirstName,
                user.LastName,
                user.Country,
                user.State,
                user.Company,
                user.DisplayName,
                user.PreferredLanguage,
                user.Title,
                user.Address
            });
        }

        [HttpPut("update")]
        public async Task<IActionResult> UpdateProfile([FromBody] ProfileUpdateRequest request)
        {
            var userIdClaim = HttpContext.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdClaim))
            {
                return Unauthorized(new
                {
                    error = "Unauthorized",
                    message = "User not authenticated"
                });
            }

            int userId = int.Parse(userIdClaim);
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == userId);

            if (user == null)
            {
                return NotFound(new
                {
                    error = "NotFound",
                    message = "User not found"
                });
            }

            UpdateUserFields(user, request);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = "Profile updated successfully",
                user = new
                {
                    user.Email,
                    user.FirstName,
                    user.LastName,
                    user.Country,
                    user.State,
                    user.Company,
                    user.DisplayName,
                    user.PreferredLanguage,
                    user.Title,
                    user.Address
                }
            });
        }

        private void UpdateUserFields(User user, ProfileUpdateRequest request)
        {
            var updates = new Dictionary<string, string?>
            {
                { nameof(user.Email), request.Email },
                { nameof(user.FirstName), request.FirstName },
                { nameof(user.LastName), request.LastName },
                { nameof(user.Country), request.Country },
                { nameof(user.State), request.State },
                { nameof(user.Company), request.Company },
                { nameof(user.DisplayName), request.DisplayName },
                { nameof(user.PreferredLanguage), request.PreferredLanguage },
                { nameof(user.Title), request.Title },
                { nameof(user.Address), request.Address }
            };

            foreach (var (property, value) in updates)
            {
                if (!string.IsNullOrEmpty(value))
                {
                    typeof(User).GetProperty(property)?.SetValue(user, value);
                }
            }
        }
    }
}
