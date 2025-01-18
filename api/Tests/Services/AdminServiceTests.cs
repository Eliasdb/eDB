using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.DTOs.Admin;
using api.Interfaces;
using api.Mapping;
using api.Models;
using api.Services;
using api.Utilities;
using AutoMapper;
using Moq;
using Xunit;

namespace api.Tests.Services
{
    public class AdminServiceTests
    {
        private readonly AdminService _adminService;
        private readonly Mock<IUserRepository> _mockUserRepository;
        private readonly Mock<IApplicationRepository> _mockApplicationRepository;
        private readonly Mock<ISubscriptionRepository> _mockSubscriptionRepository;
        private readonly IMapper _mapper;

        public AdminServiceTests()
        {
            // Configure AutoMapper
            var config = new MapperConfiguration(cfg =>
            {
                cfg.AddProfile<MappingProfile>(); // Use the mapping profile defined earlier
            });
            _mapper = config.CreateMapper();

            // Initialize mocks
            _mockUserRepository = new Mock<IUserRepository>();
            _mockApplicationRepository = new Mock<IApplicationRepository>();
            _mockSubscriptionRepository = new Mock<ISubscriptionRepository>();

            // Create AdminService instance with mocks and mapper
            _adminService = new AdminService(
                _mockUserRepository.Object,
                _mockApplicationRepository.Object,
                _mockSubscriptionRepository.Object,
                _mapper
            );
        }

        [Fact]
        public async Task GetUsersAsync_NoFilters_ReturnsPagedResult()
        {
            // Arrange
            var usersList = new List<User>
            {
                new User
                {
                    Id = 1,
                    Email = "john.doe@example.com",
                    PasswordHash = "hash1",
                    FirstName = "John",
                    LastName = "Doe",
                    Country = "USA",
                    State = "NY",
                    Company = "Company A",
                    DisplayName = "John Doe",
                    Role = UserRole.User,
                    PreferredLanguage = "English",
                    Title = "Developer",
                    Address = "123 Main St",
                    Subscriptions = new List<Subscription>(),
                },
                new User
                {
                    Id = 2,
                    Email = "jane.smith@example.com",
                    PasswordHash = "hash2",
                    FirstName = "Jane",
                    LastName = "Smith",
                    Country = "USA",
                    State = "CA",
                    Company = "Company B",
                    DisplayName = "Jane Smith",
                    Role = UserRole.Admin,
                    PreferredLanguage = "Spanish",
                    Title = "Manager",
                    Address = "456 Elm St",
                    Subscriptions = new List<Subscription>(),
                },
                // Add more users as needed
            };

            var usersQueryable = usersList.AsQueryable();
            var testAsyncUsersQueryable = new TestAsyncEnumerable<User>(usersQueryable);

            _mockUserRepository.Setup(r => r.GetUsers()).Returns(testAsyncUsersQueryable);

            string? search = null;
            string? cursor = null;
            string sort = "id,asc";
            int pageSize = 15;

            // Act
            var result = await _adminService.GetUsersAsync(search, cursor, sort, pageSize);

            // Assert
            Assert.NotNull(result);
            Assert.NotNull(result.Data);
            Assert.Equal(usersList.Count, result.Data.Count);
            Assert.Equal("John", result.Data.First().FirstName);
            Assert.Equal("Doe", result.Data.First().LastName);
            Assert.Equal("john.doe@example.com", result.Data.First().Email);

            // Depending on the implementation of QueryUtils.DetermineNextCursor,
            // you can assert HasMore and NextCursor as needed.
            Assert.False(result.HasMore);
            Assert.Null(result.NextCursor);
        }

        // Additional tests for different scenarios can be added here
    }
}
