using api.DTOs.Admin;
using api.Interfaces;
using api.Models;
using api.Repositories;
using api.Services;
using api.Utilities;
using AutoMapper;
using Moq;
using Xunit;

namespace api.Tests.Services
{
    public class AdminServiceInMemoryTests
    {
        private readonly IMapper _mapper;

        public AdminServiceInMemoryTests()
        {
            var config = new MapperConfiguration(cfg =>
            {
                cfg.CreateMap<User, UserDto>();
            });
            _mapper = config.CreateMapper();
        }

        [Fact]
        public async Task GetUsersAsync_NoFilters_ReturnsPagedResult()
        {
            // Arrange: Setup InMemory DbContext using factory
            using var context = InMemoryDbContextFactory.CreateDbContext();

            // Seed data
            context.Users.AddRange(
                new List<User>
                {
                    new()
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
                        Subscriptions = [],
                    },
                    new()
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
                        Subscriptions = [],
                    },
                }
            );
            await context.SaveChangesAsync();

            // Use actual repository with InMemory context
            var userRepository = new UserRepository(context);
            var applicationRepository = new Mock<IApplicationRepository>().Object;
            var subscriptionRepository = new Mock<ISubscriptionRepository>().Object;
            var adminService = new AdminService(
                userRepository,
                applicationRepository,
                subscriptionRepository,
                _mapper
            );

            string? search = null;
            string? cursor = null;
            string sort = "id,asc";
            int pageSize = 15;

            // Act
            var result = await adminService.GetUsersAsync(search, cursor, sort, pageSize);

            // Assert
            var pagedResult = Assert.IsType<PagedUserResult<UserDto>>(result);
            Assert.NotNull(result);
            Assert.NotNull(result.Data);
            Assert.Equal(2, result.Data.Count); // Assuming we seeded 2 users
            Assert.Equal("John", result.Data.First().FirstName);
        }

        [Fact]
        public async Task GetUsersAsync_WithSearchFilter_ReturnsFilteredResult()
        {
            // Arrange: Setup InMemory DbContext using factory, using means it will dispose after test has run of dbcontext and its data
            using var context = InMemoryDbContextFactory.CreateDbContext();

            // Seed data: two users, one with first name "Jane"
            context.Users.AddRange(
                new List<User>
                {
                    new()
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
                        Subscriptions = [],
                    },
                    new()
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
                        Subscriptions = [],
                    },
                }
            );
            await context.SaveChangesAsync();

            // Use actual repository with InMemory context
            var userRepository = new UserRepository(context);
            var applicationRepository = new Mock<IApplicationRepository>().Object;
            var subscriptionRepository = new Mock<ISubscriptionRepository>().Object;
            var adminService = new AdminService(
                userRepository,
                applicationRepository,
                subscriptionRepository,
                _mapper
            );

            string search = "Jane"; // Search filter
            string? cursor = null;
            string sort = "id,asc";
            int pageSize = 15;

            // Act
            var result = await adminService.GetUsersAsync(search, cursor, sort, pageSize);

            // Assert
            Assert.NotNull(result);
            Assert.NotNull(result.Data);

            // We expect the filtered result to only contain users matching the search term "Jane"
            var filteredUsers = result.Data.ToList();

            // Check type of result
            var pagedResult = Assert.IsType<PagedUserResult<UserDto>>(result);

            // Verify that only one user matches the search filter
            Assert.Single(filteredUsers);
            Assert.Equal("Jane", filteredUsers.First().FirstName);
            Assert.Equal("Smith", filteredUsers.First().LastName);
            Assert.Equal("jane.smith@example.com", filteredUsers.First().Email);
        }

        [Fact]
        public async Task GetUsersAsync_WithPagination_ReturnsHasMoreAndNextCursor()
        {
            // Arrange: Setup InMemory DbContext using factory
            using var context = InMemoryDbContextFactory.CreateDbContext();

            // Seed data: Add more users than pageSize
            int totalUsers = 20;
            var users = new List<User>();
            for (int i = 1; i <= totalUsers; i++)
            {
                users.Add(
                    new User
                    {
                        Id = i,
                        Email = $"user{i}@example.com",
                        PasswordHash = $"hash{i}",
                        FirstName = $"User{i}",
                        LastName = $"Test{i}",
                        Country = "USA",
                        State = "State",
                        Company = "Company",
                        DisplayName = $"User{i} Test{i}",
                        Role = UserRole.User,
                        Subscriptions = new List<Subscription>(),
                    }
                );
            }
            context.Users.AddRange(users);
            await context.SaveChangesAsync();

            // Use actual repository with InMemory context
            var userRepository = new UserRepository(context);
            var applicationRepository = new Mock<IApplicationRepository>().Object;
            var subscriptionRepository = new Mock<ISubscriptionRepository>().Object;
            var adminService = new AdminService(
                userRepository,
                applicationRepository,
                subscriptionRepository,
                _mapper
            );

            string? search = null;
            string? cursor = null;
            string sort = "id,asc";
            int pageSize = 15;

            // Act
            var result = await adminService.GetUsersAsync(search, cursor, sort, pageSize);

            // Assert
            Assert.NotNull(result);
            Assert.NotNull(result.Data);
            Assert.Equal(pageSize, result.Data.Count); // Should return exactly pageSize number of users

            // Check if pagination works
            Assert.True(
                result.HasMore,
                "Expected HasMore to be true since more than pageSize users exist."
            );
            Assert.NotNull(result.NextCursor);

            // Verify the next cursor matches the expected value
            var lastUserOnPage = result.Data.Last();
            Assert.Equal(lastUserOnPage.Id, result.NextCursor);
        }

        [Fact]
        public async Task GetUsersAsync_WithSorting_ReturnsUsersInCorrectOrder()
        {
            // Arrange: Setup InMemory DbContext using factory
            using var context = InMemoryDbContextFactory.CreateDbContext();

            // Seed data: Add users with different first names
            var users = new List<User>
            {
                new()
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
                    Subscriptions = new List<Subscription>(),
                },
                new()
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
                    Subscriptions = new List<Subscription>(),
                },
                new()
                {
                    Id = 3,
                    Email = "alex.johnson@example.com",
                    PasswordHash = "hash3",
                    FirstName = "Alex",
                    LastName = "Johnson",
                    Country = "USA",
                    State = "TX",
                    Company = "Company C",
                    DisplayName = "Alex Johnson",
                    Role = UserRole.User,
                    Subscriptions = new List<Subscription>(),
                },
            };
            context.Users.AddRange(users);
            await context.SaveChangesAsync();

            // Use actual repository with InMemory context
            var userRepository = new UserRepository(context);
            var applicationRepository = new Mock<IApplicationRepository>().Object;
            var subscriptionRepository = new Mock<ISubscriptionRepository>().Object;
            var adminService = new AdminService(
                userRepository,
                applicationRepository,
                subscriptionRepository,
                _mapper
            );

            string? search = null;
            string? cursor = null;
            string sort = "firstName,desc"; // Sorting by first name in descending order
            int pageSize = 15;

            // Act
            var result = await adminService.GetUsersAsync(search, cursor, sort, pageSize);

            // Assert
            Assert.NotNull(result);
            Assert.NotNull(result.Data);

            // Verify that users are sorted in descending order of first name
            var sortedFirstNames = result.Data.Select(u => u.FirstName).ToList();
            var expectedOrder = new List<string> { "John", "Jane", "Alex" };
            Assert.Equal(expectedOrder, sortedFirstNames);
        }

        [Fact]
        public async Task GetUsersAsync_WithSortingOnMultipleFields_ReturnsCorrectlyOrderedUsers()
        {
            // Arrange: Setup InMemory DbContext using factory
            using var context = InMemoryDbContextFactory.CreateDbContext();

            // Seed data: Add users with varying field values for sorting
            var users = new List<User>
            {
                new()
                {
                    Id = 1,
                    Email = "zack.doe@example.com",
                    PasswordHash = "hash1",
                    FirstName = "Zack",
                    LastName = "Doe",
                    Country = "USA",
                    State = "NY",
                    Company = "Company A",
                    DisplayName = "Zack Doe",
                    Role = UserRole.User,
                    Subscriptions = new List<Subscription>(),
                },
                new()
                {
                    Id = 2,
                    Email = "alex.johnson@example.com",
                    PasswordHash = "hash2",
                    FirstName = "Alex",
                    LastName = "Johnson",
                    Country = "USA",
                    State = "CA",
                    Company = "Company B",
                    DisplayName = "Alex Johnson",
                    Role = UserRole.Admin,
                    Subscriptions = new List<Subscription>(),
                },
                new()
                {
                    Id = 3,
                    Email = "jane.smith@example.com",
                    PasswordHash = "hash3",
                    FirstName = "Jane",
                    LastName = "Smith",
                    Country = "USA",
                    State = "TX",
                    Company = "Company C",
                    DisplayName = "Jane Smith",
                    Role = UserRole.User,
                    Subscriptions = new List<Subscription>(),
                },
            };
            context.Users.AddRange(users);
            await context.SaveChangesAsync();

            // Use actual repository with InMemory context
            var userRepository = new UserRepository(context);
            var applicationRepository = new Mock<IApplicationRepository>().Object;
            var subscriptionRepository = new Mock<ISubscriptionRepository>().Object;
            var adminService = new AdminService(
                userRepository,
                applicationRepository,
                subscriptionRepository,
                _mapper
            );

            string? search = null;
            string? cursor = null;
            int pageSize = 15;

            // Act & Assert: Verify sorting by last name in ascending order
            string sort = "lastName,asc"; // Sorting by last name
            var result = await adminService.GetUsersAsync(search, cursor, sort, pageSize);

            Assert.NotNull(result);
            Assert.NotNull(result.Data);

            var sortedLastNames = result.Data.Select(u => u.LastName).ToList();
            var expectedLastNameOrder = new List<string> { "Doe", "Johnson", "Smith" };
            Assert.Equal(expectedLastNameOrder, sortedLastNames);

            // Act & Assert: Verify sorting by role in ascending order
            // Act & Assert: Verify sorting by role in ascending order
            sort = "role,asc";
            result = await adminService.GetUsersAsync(search, cursor, sort, pageSize);

            // Extract the roles into a list
            var sortedRoles = result.Data.Select(u => u.Role).ToList();

            // If roles are returned as strings, adjust the expected list to match:
            var expectedRoleOrder = new List<string>
            {
                UserRole.Admin.ToString(),
                UserRole.User.ToString(),
                UserRole.User.ToString(),
            };

            // Compare the lists
            Assert.Equal(expectedRoleOrder, sortedRoles);
        }
    }
}
