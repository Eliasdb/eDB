using System.Security.Claims;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Moq;
using PlatformAPI.Controllers;
using PlatformAPI.DTOs.Profile;
using PlatformAPI.Interfaces;
using PlatformAPI.Models;

namespace PlatformAPITests.Controllers
{
    public class ProfileControllerTests
    {
        private readonly Mock<IProfileService> _mockProfileService;
        private readonly ProfileController _controller;

        public ProfileControllerTests()
        {
            _mockProfileService = new Mock<IProfileService>();
            _controller = new ProfileController(_mockProfileService.Object)
            {
                ControllerContext = new ControllerContext
                {
                    HttpContext = new DefaultHttpContext(),
                },
            };
        }

        [Fact]
        public async Task GetProfileSettings_UserNotAuthenticated_ReturnsUnauthorized()
        {
            // Arrange
            _mockProfileService
                .Setup(s => s.GetAuthenticatedUserAsync(It.IsAny<ClaimsPrincipal>()))
                .ReturnsAsync((User?)null);

            // Act
            var result = await _controller.GetProfileSettings();

            // Assert
            var unauthorizedResult = Assert.IsType<UnauthorizedObjectResult>(result.Result);
            dynamic value = unauthorizedResult.Value!;
            Assert.Equal("Unauthorized", (string)value.error);
            Assert.Equal("User not authenticated!", (string)value.message);
        }

        [Fact]
        public async Task GetProfileSettings_ProfileNotFound_ReturnsNotFound()
        {
            // Arrange
            var user = new User
            {
                Id = 1,
                Email = "user@example.com",
                PasswordHash = "hash",
                FirstName = "First",
                LastName = "Last",
                Country = "Country",
                State = "State",
                Company = "Company",
                DisplayName = "DisplayName",
                Role = UserRole.User,
                Subscriptions = new List<Subscription>(),
            };
            _mockProfileService
                .Setup(s => s.GetAuthenticatedUserAsync(It.IsAny<ClaimsPrincipal>()))
                .ReturnsAsync(user);
            _mockProfileService
                .Setup(s => s.GetUserProfile(user))
                .Returns((ProfileSettingsResponse?)null);

            // Act
            var result = await _controller.GetProfileSettings();

            // Assert
            var notFoundResult = Assert.IsType<NotFoundObjectResult>(result.Result);
            dynamic value = notFoundResult.Value!;
            Assert.Equal("NotFound", (string)value.error);
            Assert.Equal("Profile could not be mapped.", (string)value.message);
        }

        [Fact]
        public async Task GetProfileSettings_Success_ReturnsOk()
        {
            // Arrange
            var user = new User
            {
                Id = 1,
                Email = "user@example.com",
                PasswordHash = "hash",
                FirstName = "First",
                LastName = "Last",
                Country = "Country",
                State = "State",
                Company = "Company",
                DisplayName = "DisplayName",
                Role = UserRole.User,
                Subscriptions = new List<Subscription>(),
            };
            var profileResponse = new ProfileSettingsResponse
            {
                Email = "user@example.com",
                FirstName = "First",
                LastName = "Last",
                Country = "Country",
                State = "State",
                Company = "Company",
                DisplayName = "DisplayName",
                PreferredLanguage = "English",
                Title = "Title",
                Address = "Address",
            };
            _mockProfileService
                .Setup(s => s.GetAuthenticatedUserAsync(It.IsAny<ClaimsPrincipal>()))
                .ReturnsAsync(user);
            _mockProfileService.Setup(s => s.GetUserProfile(user)).Returns(profileResponse);

            // Act
            var result = await _controller.GetProfileSettings();

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            Assert.Equal(profileResponse, okResult.Value);
        }

        [Fact]
        public async Task UpdateProfile_UserNotAuthenticated_ReturnsUnauthorized()
        {
            // Arrange
            var request = new ProfileUpdateRequest
            {
                // Initialize properties as necessary for update
            };
            _mockProfileService
                .Setup(s => s.GetAuthenticatedUserAsync(It.IsAny<ClaimsPrincipal>()))
                .ReturnsAsync((User?)null);

            // Act
            var result = await _controller.UpdateProfile(request);

            // Assert
            var unauthorizedResult = Assert.IsType<UnauthorizedObjectResult>(result);
            dynamic value = unauthorizedResult.Value!;
            Assert.Equal("Unauthorized", (string)value.error);
            Assert.Equal("User not authenticated.", (string)value.message);
        }

        [Fact]
        public async Task UpdateProfile_Success_ReturnsOkWithMessageAndUser()
        {
            // Arrange
            var request = new ProfileUpdateRequest
            {
                // Initialize properties as necessary for update
            };
            var user = new User
            {
                Id = 1,
                Email = "user@example.com",
                PasswordHash = "hash",
                FirstName = "First",
                LastName = "Last",
                Country = "Country",
                State = "State",
                Company = "Company",
                DisplayName = "DisplayName",
                Role = UserRole.User,
                Subscriptions = new List<Subscription>(),
            };
            var profileResponse = new ProfileSettingsResponse
            {
                Email = "user@example.com",
                FirstName = "First",
                LastName = "Last",
                Country = "Country",
                State = "State",
                Company = "Company",
                DisplayName = "DisplayName",
                PreferredLanguage = "English",
                Title = "Title",
                Address = "Address",
            };

            _mockProfileService
                .Setup(s => s.GetAuthenticatedUserAsync(It.IsAny<ClaimsPrincipal>()))
                .ReturnsAsync(user);
            _mockProfileService
                .Setup(s => s.UpdateUserProfileAsync(user, request))
                .Returns(Task.CompletedTask);
            _mockProfileService.Setup(s => s.GetUserProfile(user)).Returns(profileResponse);

            // Act
            var result = await _controller.UpdateProfile(request);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            dynamic value = okResult.Value!;
            Assert.Equal("Profile updated successfully!", (string)value.message);
            Assert.Equal(profileResponse, value.user);
        }
    }
}
