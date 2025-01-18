using System.Security.Claims;
using api.Controllers;
using api.DTOs.Applications;
using api.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Moq;
using Xunit;
using Xunit.Abstractions;

namespace api.Tests.Controllers
{
    public class ApplicationsControllerTests
    {
        private readonly Mock<IApplicationsService> _mockApplicationsService;
        private readonly ApplicationsController _controller;
        private readonly ITestOutputHelper _output;

        public ApplicationsControllerTests(ITestOutputHelper output)
        {
            _mockApplicationsService = new Mock<IApplicationsService>();
            _controller = new ApplicationsController(_mockApplicationsService.Object);
            _output = output;
        }

        #region GetApplications Tests
        [Fact]
        public async Task GetApplications_ReturnsOkWithApplications()
        {
            // Arrange
            var expectedApps = new List<ApplicationDto>
            {
                new ApplicationDto
                {
                    Id = 1,
                    Name = "App1",
                    Description = "Description for App1",
                    IconUrl = "http://example.com/icon1.png",
                    RoutePath = "/app1",
                    Tags = new List<string> { "tag1", "tag2" },
                },
                new ApplicationDto
                {
                    Id = 2,
                    Name = "App2",
                    Description = "Description for App2",
                    IconUrl = "http://example.com/icon2.png",
                    RoutePath = "/app2",
                    Tags = new List<string> { "tag3", "tag4" },
                },
            };

            _mockApplicationsService
                .Setup(s => s.GetApplicationsAsync())
                .ReturnsAsync(expectedApps);

            // Act
            var actionResult = await _controller.GetApplications();

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(actionResult.Result);
            Assert.NotNull(okResult.Value);

            var returnedApps = Assert.IsType<IEnumerable<ApplicationDto>>(
                okResult.Value,
                exactMatch: false
            );
            Assert.Equal(expectedApps.Count, returnedApps.Count());
        }
        #endregion

        #region SubscribeToApplication Tests
        [Fact]
        public async Task SubscribeToApplication_UserNotAuthenticated_ReturnsUnauthorized()
        {
            // Arrange
            var subscribeRequest = new SubscribeRequest { ApplicationId = 1 };
            _mockApplicationsService
                .Setup(s => s.GetAuthenticatedUserId(It.IsAny<ClaimsPrincipal>()))
                .Returns((int?)null);

            // Act
            var result = await _controller.SubscribeToApplication(subscribeRequest);

            // Assert
            var unauthorizedResult = Assert.IsType<UnauthorizedObjectResult>(result);
            dynamic response = unauthorizedResult.Value!;
            Assert.Equal("User is not authenticated.", (string)response.message);
        }

        [Fact]
        public async Task SubscribeToApplication_UserAuthenticated_ReturnsOkWithMessage()
        {
            // Arrange
            var subscribeRequest = new SubscribeRequest { ApplicationId = 1 };
            int userId = 42;
            string expectedMessage = "Subscription toggled";

            _mockApplicationsService
                .Setup(s => s.GetAuthenticatedUserId(It.IsAny<ClaimsPrincipal>()))
                .Returns(userId);
            _mockApplicationsService
                .Setup(s => s.ToggleSubscriptionAsync(userId, subscribeRequest.ApplicationId))
                .ReturnsAsync(expectedMessage);

            // Act
            var result = await _controller.SubscribeToApplication(subscribeRequest);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            dynamic response = okResult.Value!;
            Assert.Equal(expectedMessage, (string)response.message);
        }
        #endregion

        #region GetUserApplications Tests
        [Fact]
        public async Task GetUserApplications_UserNotAuthenticated_ReturnsUnauthorized()
        {
            // Arrange
            _mockApplicationsService
                .Setup(s => s.GetAuthenticatedUserId(It.IsAny<ClaimsPrincipal>()))
                .Returns((int?)null);

            // Act
            var actionResult = await _controller.GetUserApplications();

            // Assert
            var unauthorizedResult = Assert.IsType<UnauthorizedObjectResult>(actionResult.Result);
            dynamic response = unauthorizedResult.Value!;
            Assert.Equal("User is not authenticated!", (string)response.message);
        }

        [Fact]
        public async Task GetUserApplications_UserAuthenticated_ReturnsOkWithApplications()
        {
            // Arrange
            int userId = 42;
            var expectedApps = new List<ApplicationDto>
            {
                new()
                {
                    Id = 1,
                    Name = "App1",
                    Description = "Desc1",
                    IconUrl = "http://example.com/icon1.png",
                    RoutePath = "/app1",
                    Tags = new List<string> { "tag1", "tag2" },
                },
                new()
                {
                    Id = 2,
                    Name = "App2",
                    Description = "Desc2",
                    IconUrl = "http://example.com/icon2.png",
                    RoutePath = "/app2",
                    Tags = new List<string> { "tag3", "tag4" },
                },
            };

            _mockApplicationsService
                .Setup(s => s.GetAuthenticatedUserId(It.IsAny<ClaimsPrincipal>()))
                .Returns(userId);
            _mockApplicationsService
                .Setup(s => s.GetSubscribedApplicationsAsync(userId))
                .ReturnsAsync(expectedApps);

            // Act
            var actionResult = await _controller.GetUserApplications();

            // Assert
            // Unwrap the ActionResult to get the underlying IActionResult
            var okResult = Assert.IsType<OkObjectResult>(actionResult.Result);
            Assert.NotNull(okResult.Value);

            // Assert that the returned value is a collection of ApplicationDto
            var returnedApps = Assert.IsType<IEnumerable<ApplicationDto>>(
                okResult.Value,
                exactMatch: false
            );
            Assert.Equal(expectedApps.Count, returnedApps.Count());
        }
        #endregion
    }
}
