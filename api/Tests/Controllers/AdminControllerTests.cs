using api.Controllers;
using api.DTOs.Admin;
using api.Interfaces;
using api.Models;
using Microsoft.AspNetCore.Mvc;
using Moq;
using Xunit;
using Xunit.Abstractions;

namespace api.Tests.Controllers
{
    public class AdminControllerTests
    {
        private readonly Mock<IAdminService> _mockAdminService;
        private readonly AdminController _controller;
        private readonly ITestOutputHelper _output;

        public AdminControllerTests(ITestOutputHelper output)
        {
            _mockAdminService = new Mock<IAdminService>();
            _controller = new AdminController(_mockAdminService.Object);
            _output = output;
        }

        [Fact]
        public async Task GetUserById_UserExists_ReturnsOkResult()
        {
            // Arrange
            var userId = 1;
            var mockUser = new UserDto
            {
                Id = userId,
                FirstName = "John",
                LastName = "Doe",
            };
            _mockAdminService.Setup(s => s.GetUserByIdAsync(userId)).ReturnsAsync(mockUser);

            // Act
            var result = await _controller.GetUserById(userId);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            var returnedUser = Assert.IsType<UserDto>(okResult.Value);
            Assert.Equal(userId, returnedUser.Id);
        }

        [Fact]
        public async Task GetUserById_UserNotFound_ReturnsNotFoundResult()
        {
            // Arrange
            var userId = 99; // Assume this ID doesn't exist
            _mockAdminService.Setup(s => s.GetUserByIdAsync(userId)).ReturnsAsync((UserDto?)null);

            // Act
            var result = await _controller.GetUserById(userId);

            // Assert
            Assert.IsType<NotFoundObjectResult>(result);
        }

        [Fact]
        public async Task DeleteUser_UserExists_ReturnsOkResult()
        {
            // Arrange
            var userId = 1;
            _mockAdminService.Setup(s => s.DeleteUserAsync(userId)).ReturnsAsync(true);

            // Act
            var result = await _controller.DeleteUser(userId);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);

            // Ensure Value is not null
            Assert.NotNull(okResult.Value);

            // Use null-forgiving operator since we've asserted Value is not null
            dynamic response = okResult.Value!;

            // Access the Message property; use null-forgiving if needed
            string message = response.Message!;

            Assert.Equal("User deleted successfully.", message);
        }

        [Fact]
        public async Task DeleteUser_UserNotFound_ReturnsNotFoundResult()
        {
            // Arrange
            var userId = 99;
            _mockAdminService.Setup(s => s.DeleteUserAsync(userId)).ReturnsAsync(false);

            // Act
            var result = await _controller.DeleteUser(userId);

            // Assert
            var notFoundResult = Assert.IsType<NotFoundObjectResult>(result);

            // Ensure Value is not null
            Assert.NotNull(notFoundResult.Value);

            // Use null-forgiving operator since we've asserted Value is not null
            dynamic response = notFoundResult.Value!;

            // Access the Message property; use null-forgiving if needed
            string message = response.Message!;

            Assert.Equal("User not found.", message);
        }

        [Fact]
        public async Task GetApplications_ReturnsOkResult_WithApplicationsList()
        {
            // Arrange
            // Create a sample list of ApplicationOverviewDto objects with required properties set
            var applications = new List<ApplicationOverviewDto>
            {
                new()
                {
                    ApplicationId = 1,
                    ApplicationName = "Test App 1",
                    ApplicationIconUrl = "http://example.com/icon1.png",
                    ApplicationRoutePath = "/test-app-1",
                    ApplicationTags = ["tag1", "tag2"],
                    ApplicationDescription = "Description for Test App 1",
                },
                new()
                {
                    ApplicationId = 2,
                    ApplicationName = "Test App 2",
                    ApplicationIconUrl = "http://example.com/icon2.png",
                    ApplicationRoutePath = "/test-app-2",
                    ApplicationTags = ["tag3", "tag4"],
                    ApplicationDescription = "Description for Test App 2",
                },
            };

            // Set up the mock to return the sample list
            _mockAdminService.Setup(s => s.GetApplicationsAsync()).ReturnsAsync(applications);

            // Act
            var result = await _controller.GetApplications();

            // Assert
            // Verify the result is an OkObjectResult
            var okResult = Assert.IsType<OkObjectResult>(result);
            Assert.NotNull(okResult.Value);

            // Check that the returned value is a list of ApplicationOverviewDto
            var returnedApplications = Assert.IsType<IEnumerable<ApplicationOverviewDto>>(
                okResult.Value,
                exactMatch: false
            );

            // Optionally, validate that the returned list matches the expected list
            Assert.Equal(applications.Count, returnedApplications.Count());
            // Further assertions can check properties of each item if needed
        }

        [Fact]
        public async Task AddApplication_ValidDto_ReturnsCreatedResult_WithApplication()
        {
            // Arrange
            var createDto = new CreateApplicationDto
            {
                Name = "New App",
                IconUrl = "http://example.com/icon.png",
                RoutePath = "/new-app",
                Tags = ["tag1", "tag2"],
                Description = "Description for New App",
            };

            var createdApplication = new Application
            {
                Id = 1,
                Name = createDto.Name,
                IconUrl = createDto.IconUrl,
                RoutePath = createDto.RoutePath,
                Tags = createDto.Tags,
                Description = createDto.Description,
            };

            _mockAdminService
                .Setup(s => s.AddApplicationAsync(createDto))
                .ReturnsAsync(createdApplication);

            // Act
            var result = await _controller.AddApplication(createDto);

            // Assert
            var createdResult = Assert.IsType<CreatedResult>(result);

            // Verify status code 201
            Assert.Equal(StatusCodes.Status201Created, createdResult.StatusCode);

            // Verify Location header value
            var expectedLocation = $"api/applications/{createdApplication.Id}";
            Assert.Equal(expectedLocation, createdResult.Location);

            // Verify response body contains the created application
            var returnedApplication = Assert.IsType<Application>(createdResult.Value);
            Assert.Equal(createdApplication.Id, returnedApplication.Id);
            Assert.Equal(createdApplication.Name, returnedApplication.Name);
            Assert.Equal(createdApplication.IconUrl, returnedApplication.IconUrl);
            Assert.Equal(createdApplication.RoutePath, returnedApplication.RoutePath);
            Assert.Equal(createdApplication.Tags, returnedApplication.Tags);
            Assert.Equal(createdApplication.Description, returnedApplication.Description);
        }

        [Fact]
        public async Task AddApplication_ServiceReturnsNull_ReturnsBadRequest()
        {
            // Arrange
            var createDto = new CreateApplicationDto
            {
                Name = "New App",
                IconUrl = "http://example.com/icon.png",
                RoutePath = "/new-app",
                Tags = new List<string> { "tag1", "tag2" },
                Description = "Description for New App",
            };

            _mockAdminService
                .Setup(s => s.AddApplicationAsync(createDto))
                .Returns(Task.FromResult<Application?>(null) as Task<Application>);

            // Act
            var result = await _controller.AddApplication(createDto);

            // Assert
            var badRequestResult = Assert.IsType<BadRequestObjectResult>(result);
            Assert.Equal("Unable to create application.", badRequestResult.Value);
        }

        [Fact]
        public async Task UpdateApplication_ApplicationExists_ReturnsOkResult()
        {
            // Arrange
            int applicationId = 1;
            var updateDto = new UpdateApplicationDto
            {
                // Initialize properties as needed for update
            };

            var updatedApplication = new Application
            {
                Id = applicationId,
                // Initialize other properties to simulate an updated application
            };

            _mockAdminService
                .Setup(s => s.UpdateApplicationAsync(applicationId, updateDto))
                .ReturnsAsync(updatedApplication);

            // Act
            var result = await _controller.UpdateApplication(applicationId, updateDto);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);

            dynamic response = okResult.Value;
            Assert.Equal("Application updated successfully.", (string)response.Message);

            // Verify the application in the response matches the updated application
            var returnedApplication = response.Application as Application;
            Assert.NotNull(returnedApplication);
            Assert.Equal(updatedApplication.Id, returnedApplication.Id);
            // Optionally check other properties...
        }
    }
}
