using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Moq;
using PlatformAPI.Controllers;
using PlatformAPI.DTOs;
using PlatformAPI.DTOs.Admin;
using PlatformAPI.Interfaces;
using PlatformAPI.Models;
using Xunit;
using Xunit.Abstractions;

namespace PlatformAPITests.Controllers
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

        #region GetUsers Tests
        [Fact]
        public async Task GetUsers_ReturnsOkResult_WithPagedResult()
        {
            // Arrange
            string? cursor = null;
            string sort = "id,asc";
            string? search = null;

            var pagedResult = new PagedUserResult<UserDto>
            {
                Data = new List<UserDto>
                {
                    new()
                    {
                        Id = 1,
                        FirstName = "John",
                        LastName = "Doe",
                        Email = "john.doe@example.com",
                        Role = "Admin",
                        State = "Active",
                    },
                    new()
                    {
                        Id = 2,
                        FirstName = "Jane",
                        LastName = "Smith",
                        Email = "jane.smith@example.com",
                        Role = "User",
                        State = "Inactive",
                    },
                },
                NextCursor = "nextCursorValue",
                HasMore = true,
            };

            _mockAdminService
                .Setup(s => s.GetUsersAsync(search, cursor, sort, 15))
                .ReturnsAsync(pagedResult);

            // Act
            var actionResult = await _controller.GetUsers(cursor, sort, search);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(actionResult.Result);
            Assert.NotNull(okResult.Value);

            var returnedResult = Assert.IsType<PagedUserResult<UserDto>>(okResult.Value);
            Assert.Equal(pagedResult.Data.Count(), returnedResult.Data.Count);
            Assert.Equal(pagedResult.NextCursor, returnedResult.NextCursor);
            Assert.Equal(pagedResult.HasMore, returnedResult.HasMore);

            // Optionally, verify details of the user data
            var expectedFirstUser = pagedResult.Data.First();
            var actualFirstUser = returnedResult.Data.First();
            Assert.Equal(expectedFirstUser.Id, actualFirstUser.Id);
            Assert.Equal(expectedFirstUser.FirstName, actualFirstUser.FirstName);
        }
        #endregion

        #region GetUserById Tests
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
            var actionResult = await _controller.GetUserById(userId);

            // Assert

            var okResult = Assert.IsType<OkObjectResult>(actionResult.Result);
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
            var actionResult = await _controller.GetUserById(userId);

            // Assert
            Assert.IsType<NotFoundObjectResult>(actionResult.Result);
        }
        #endregion

        #region DeleteUser Tests
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
            Assert.NotNull(okResult.Value);

            // Cast to ApiResponse
            var response = Assert.IsType<ApiResponse>(okResult.Value);

            // Assert the message
            Assert.Equal("User deleted successfully.", response.Message);
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

            // Cast to ApiResponse
            var response = Assert.IsType<ApiResponse>(notFoundResult.Value);

            // Assert the Message property
            Assert.Equal("User not found.", response.Message);
        }

        #endregion

        #region GetApplications Tests
        [Fact]
        public async Task GetApplications_ReturnsOkResult_WithApplicationsList()
        {
            // Arrange
            var applications = new List<ApplicationOverviewDto>
            {
                new()
                {
                    ApplicationId = 1,
                    ApplicationName = "Test App 1",
                    ApplicationIconUrl = "http://example.com/icon1.png",
                    ApplicationRoutePath = "/test-app-1",
                    ApplicationTags = new List<string> { "tag1", "tag2" },
                    ApplicationDescription = "Description for Test App 1",
                },
                new()
                {
                    ApplicationId = 2,
                    ApplicationName = "Test App 2",
                    ApplicationIconUrl = "http://example.com/icon2.png",
                    ApplicationRoutePath = "/test-app-2",
                    ApplicationTags = new List<string> { "tag3", "tag4" },
                    ApplicationDescription = "Description for Test App 2",
                },
            };

            _mockAdminService
                .Setup(s => s.GetApplicationsWithSubscribersAsync())
                .ReturnsAsync(applications);

            // Act
            var actionResult = await _controller.GetApplicationsWithSubscribers();

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(actionResult.Result);
            Assert.NotNull(okResult.Value);

            var returnedApplications = Assert.IsAssignableFrom<IEnumerable<ApplicationOverviewDto>>(
                okResult.Value
            );

            Assert.Equal(applications.Count, returnedApplications.Count());
        }

        #endregion

        #region AddApplication Tests
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
        #endregion

        #region UpdateApplication Tests
        [Fact]
        public async Task UpdateApplication_ApplicationExists_ReturnsOkResult()
        {
            // Arrange
            int applicationId = 1;
            var updateDto = new UpdateApplicationDto
            {
                Name = "Updated Name",
                Description = "Updated Description",
                IconUrl = "http://example.com/icon_updated.png",
                RoutePath = "/updated-route",
                Tags = new List<string> { "updatedTag1", "updatedTag2" },
            };

            var updatedApplication = new Application
            {
                Id = applicationId,
                Name = updateDto.Name ?? "Default Name",
                Description = updateDto.Description ?? "Default Description",
                IconUrl = updateDto.IconUrl ?? "http://example.com/default_icon.png",
                RoutePath = updateDto.RoutePath ?? "/default-route",
                Tags = updateDto.Tags ?? new List<string>(),
                Subscriptions = new List<Subscription>(),
            };

            _mockAdminService
                .Setup(s => s.UpdateApplicationAsync(applicationId, updateDto))
                .ReturnsAsync(updatedApplication);

            // Act
            var result = await _controller.UpdateApplication(applicationId, updateDto);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);

            // Ensure the Value is not null to satisfy nullability checks.
            Assert.NotNull(okResult.Value);

            // Use the null-forgiving operator after asserting non-null.
            dynamic response = okResult.Value!;

            Assert.Equal("Application updated successfully.", (string)response.Message);

            var returnedApplication = response.Application as Application;
            Assert.NotNull(returnedApplication);
            Assert.Equal(updatedApplication.Id, returnedApplication.Id);
            Assert.Equal(updatedApplication.Name, returnedApplication.Name);
            Assert.Equal(updatedApplication.Description, returnedApplication.Description);
            Assert.Equal(updatedApplication.IconUrl, returnedApplication.IconUrl);
            Assert.Equal(updatedApplication.RoutePath, returnedApplication.RoutePath);
            Assert.Equal(updatedApplication.Tags, returnedApplication.Tags);
        }
        #endregion

        #region RevokeSubscription Tests
        [Fact]
        public async Task RevokeSubscription_SubscriptionExists_ReturnsOk()
        {
            // Arrange
            int applicationId = 1;
            int userId = 2;
            _mockAdminService
                .Setup(s => s.RevokeSubscriptionAsync(applicationId, userId))
                .ReturnsAsync(true);

            // Act
            var result = await _controller.RevokeSubscription(applicationId, userId);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            Assert.NotNull(okResult.Value);

            dynamic response = okResult.Value!;
            Assert.Equal("Subscription revoked successfully.", (string)response.Message);
        }

        [Fact]
        public async Task RevokeSubscription_SubscriptionNotFound_ReturnsNotFound()
        {
            // Arrange
            int applicationId = 1;
            int userId = 2;
            _mockAdminService
                .Setup(s => s.RevokeSubscriptionAsync(applicationId, userId))
                .ReturnsAsync(false);

            // Act
            var result = await _controller.RevokeSubscription(applicationId, userId);

            // Assert
            var notFoundResult = Assert.IsType<NotFoundObjectResult>(result);
            Assert.NotNull(notFoundResult.Value);

            dynamic response = notFoundResult.Value!;
            Assert.Equal("Subscription not found.", (string)response.Message);
        }
        #endregion

        #region DeleteApplication Tests
        [Fact]
        public async Task DeleteApplication_ApplicationExists_ReturnsOk()
        {
            // Arrange
            int applicationId = 1;
            _mockAdminService
                .Setup(s => s.DeleteApplicationAsync(applicationId))
                .ReturnsAsync(true);

            // Act
            var result = await _controller.DeleteApplication(applicationId);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            Assert.NotNull(okResult.Value);

            dynamic response = okResult.Value!;
            Assert.Equal("Application deleted successfully.", (string)response.Message);
        }

        [Fact]
        public async Task DeleteApplication_ApplicationNotFound_ReturnsNotFound()
        {
            // Arrange
            int applicationId = 99; // Assume this ID does not exist
            _mockAdminService
                .Setup(s => s.DeleteApplicationAsync(applicationId))
                .ReturnsAsync(false);

            // Act
            var result = await _controller.DeleteApplication(applicationId);

            // Assert
            var notFoundResult = Assert.IsType<NotFoundObjectResult>(result);
            Assert.NotNull(notFoundResult.Value);

            dynamic response = notFoundResult.Value!;
            Assert.Equal("Application not found.", (string)response.Message);
        }
        #endregion
    }
}
