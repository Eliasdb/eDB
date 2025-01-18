using System.Collections.Generic;
using System.Threading.Tasks;
using api.Controllers;
using api.DTOs.Admin; // Ensure UserDto is accessible from here
using api.DTOs.Auth;
using api.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Moq;
using Xunit;

namespace api.Tests.Controllers
{
    public class AuthControllerTests
    {
        private readonly Mock<IAuthService> _mockAuthService;
        private readonly AuthController _controller;

        public AuthControllerTests()
        {
            _mockAuthService = new Mock<IAuthService>();
            _controller = new AuthController(_mockAuthService.Object);
        }

        [Fact]
        public async Task Register_Success_ReturnsOk()
        {
            // Arrange
            var request = new RegisterRequest
            {
                Email = "test@example.com",
                Password = "password123",
                FirstName = "John",
                LastName = "Doe",
                Country = "USA",
                State = "NY",
                Company = "Test Company",
            };

            var userDto = new UserDto
            {
                Id = 1,
                Email = "test@example.com",
                FirstName = "John",
                LastName = "Doe",
                Country = "USA",
                State = "NY",
                Company = "Test Company",
                DisplayName = "John Doe",
                Role = "User",
                // Optional fields can remain unset
                PreferredLanguage = null,
                Title = null,
                Address = null,
                PhoneNumber = null,
            };

            var message = "Registration successful";

            var returnValue = (Success: true, Message: message, User: userDto);

            _mockAuthService.Setup(s => s.RegisterUserAsync(request)).ReturnsAsync(returnValue);

            // Act
            var result = await _controller.Register(request);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            dynamic value = okResult.Value!;
            Assert.Equal(message, (string)value.message);
            Assert.NotNull(value.user);
        }

        [Fact]
        public async Task Register_Failure_ReturnsBadRequest()
        {
            // Arrange
            var request = new RegisterRequest
            {
                Email = "test@example.com",
                Password = "password123",
                FirstName = "John",
                LastName = "Doe",
                Country = "USA",
                State = "NY",
                Company = "Test Company",
            };

            var message = "Email already exists";

            _mockAuthService
                .Setup(s => s.RegisterUserAsync(request))
                .ReturnsAsync((false, message, (UserDto?)null));

            // Act
            var result = await _controller.Register(request);

            // Assert
            var badRequest = Assert.IsType<BadRequestObjectResult>(result);
            dynamic value = badRequest.Value!;
            Assert.Equal("ValidationError", (string)value.error);
            Assert.Equal(message, (string)value.message);
        }

        [Fact]
        public async Task Login_Success_ReturnsOk()
        {
            // Arrange
            var request = new LoginRequest { Email = "test@example.com", Password = "password123" };

            var token = "fake-jwt-token";
            var userDto = new UserDto
            {
                Id = 1,
                Email = "test@example.com",
                FirstName = "John",
                LastName = "Doe",
                Country = "USA",
                State = "NY",
                Company = "Test Company",
                DisplayName = "John Doe",
                Role = "User",
                PreferredLanguage = null,
                Title = null,
                Address = null,
                PhoneNumber = null,
            };
            var message = "Login successful";

            var returnValue = (Success: true, Message: message, Token: token, User: userDto);

            _mockAuthService.Setup(s => s.LoginAsync(request)).ReturnsAsync(returnValue);

            // Act
            var result = await _controller.Login(request);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            dynamic value = okResult.Value!;
            Assert.Equal(message, (string)value.message);
            Assert.Equal(token, (string)value.token);
            Assert.NotNull(value.user);
        }

        [Fact]
        public async Task Login_Failure_ReturnsUnauthorized()
        {
            // Arrange
            var request = new LoginRequest
            {
                Email = "test@example.com",
                Password = "wrongpassword",
            };

            var message = "Invalid credentials";

            _mockAuthService
                .Setup(s => s.LoginAsync(request))
                .ReturnsAsync((false, message, (string?)null, (UserDto?)null));

            // Act
            var result = await _controller.Login(request);

            // Assert
            var unauthorizedResult = Assert.IsType<UnauthorizedObjectResult>(result);
            dynamic value = unauthorizedResult.Value!;
            Assert.Equal("InvalidCredentials", (string)value.error);
            Assert.Equal(message, (string)value.message);
        }
    }
}
