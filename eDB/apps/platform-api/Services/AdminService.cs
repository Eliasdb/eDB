using System.Linq.Dynamic.Core;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using EDb.Domain.Entities;
using EDb.Domain.Interfaces;
using Edb.PlatformAPI.DTOs.Admin;
using Edb.PlatformAPI.Interfaces;
using Edb.PlatformAPI.Utilities;
using Microsoft.EntityFrameworkCore;

namespace Edb.PlatformAPI.Services
{
  public class AdminService(
    // IUserRepository userRepository,
    IApplicationRepository applicationRepository,
    ISubscriptionRepository subscriptionRepository,
    IMapper mapper
  ) : IAdminService
  {
    // private readonly IUserRepository _userRepository = userRepository;
    private readonly IApplicationRepository _applicationRepository = applicationRepository;
    private readonly ISubscriptionRepository _subscriptionRepository = subscriptionRepository;
    private readonly IMapper _mapper = mapper;

    // public async Task<PagedUserResult<UserDto>> GetUsersAsync(
    //   string? search,
    //   string? cursor,
    //   string sort,
    //   int pageSize = 15
    // )
    // {
    //   // Allowed sort fields and mapping
    //   var allowedSortFields = new List<string>
    //   {
    //     "Id",
    //     "FirstName",
    //     "LastName",
    //     "Email",
    //     "Role",
    //     "State",
    //   };
    //   var fieldMapping = new Dictionary<string, string>
    //   {
    //     { "firstName", "FirstName" },
    //     { "lastName", "LastName" },
    //     { "email", "Email" },
    //     { "role", "Role" },
    //     { "state", "State" },
    //     { "id", "Id" },
    //   };

    //   // Parse sorting parameters
    //   var (sortField, sortDirection) = QueryUtils.ParseSortParameter(sort, fieldMapping);

    //   // Fetch base query
    //   var query = _userRepository.GetUsers();

    //   // Apply filters and sorting
    //   if (!string.IsNullOrWhiteSpace(search))
    //   {
    //     var pattern = $"%{search}%";
    //     query = query.Where(u =>
    //       (u.FirstName != null && EF.Functions.Like(u.FirstName, pattern))
    //       || (u.LastName != null && EF.Functions.Like(u.LastName, pattern))
    //       || (u.Email != null && EF.Functions.Like(u.Email, pattern))
    //     );
    //   }

    //   query = QueryUtils.ApplySorting(query, sortField, sortDirection, allowedSortFields);

    //   // Apply cursor-based pagination
    //   if (cursor != null)
    //   {
    //     if (sortDirection == "asc")
    //     {
    //       query = query.Where($"{sortField} > @0", cursor);
    //     }
    //     else
    //     {
    //       query = query.Where($"{sortField} < @0", cursor);
    //     }
    //   }

    //   // Fetch the next set of users
    //   var users = await query
    //     .Take(pageSize)
    //     .ProjectTo<UserDto>(_mapper.ConfigurationProvider)
    //     .ToListAsync();

    //   // Determine pagination details
    //   var (hasMore, nextCursor) = QueryUtils.DetermineNextCursor(users, sortField, sortDirection);

    //   // Construct the paged result
    //   return new PagedUserResult<UserDto>
    //   {
    //     Data = users,
    //     NextCursor = nextCursor,
    //     HasMore = hasMore,
    //   };
    // }

    // public async Task<UserDto?> GetUserByIdAsync(int userId)
    // {
    //   var user = await _userRepository.GetByIdAsync(userId);
    //   return user != null ? _mapper.Map<UserDto>(user) : null;
    // }

    // public async Task<bool> DeleteUserAsync(int userId)
    // {
    //   var user = await _userRepository.GetByIdAsync(userId);
    //   if (user == null)
    //   {
    //     return false; // User not found
    //   }

    //   await _userRepository.DeleteAsync(user);
    //   await _userRepository.SaveChangesAsync();
    //   return true; // User deleted successfully
    // }

    public async Task<List<ApplicationOverviewDto>> GetApplicationsWithSubscribersAsync()
    {
      var applications = await _applicationRepository.GetApplicationsAsync();
      return _mapper.Map<List<ApplicationOverviewDto>>(applications);
    }

    public async Task<Application> AddApplicationAsync(CreateApplicationDto applicationDto)
    {
      // Map the DTO to the Application entity
      var application = _mapper.Map<Application>(applicationDto);

      // Add the application to the repository
      await _applicationRepository.AddApplicationAsync(application);

      // Save changes to the database
      await _applicationRepository.SaveChangesAsync();

      return application;
    }

    public async Task<Application?> UpdateApplicationAsync(
      int applicationId,
      UpdateApplicationDto applicationDto
    )
    {
      // Fetch the application by ID
      var application = await _applicationRepository.GetByIdAsync(applicationId);

      if (application == null)
      {
        return null; // Application not found
      }

      // Map the DTO to the existing application entity
      _mapper.Map(applicationDto, application);

      // Update the application in the repository
      await _applicationRepository.UpdateApplicationAsync(application);

      // Save changes
      await _applicationRepository.SaveChangesAsync();

      return application;
    }

    public async Task<bool> DeleteApplicationAsync(int applicationId)
    {
      // Fetch the application by ID
      var application = await _applicationRepository.GetByIdAsync(applicationId);
      if (application == null)
      {
        return false; // Application not found
      }

      // Remove the application
      await _applicationRepository.DeleteApplicationAsync(application);

      // Save changes to the database
      await _applicationRepository.SaveChangesAsync();

      return true; // Application deleted successfully
    }

    // public async Task<bool> RevokeSubscriptionAsync(int applicationId, int userId)
    // {
    //   // Fetch the subscription by applicationId and userId
    //   var subscription = await _subscriptionRepository.GetSubscriptionAsync(applicationId, userId);

    //   if (subscription == null)
    //   {
    //     return false; // Subscription not found
    //   }

    //   // Remove the subscription
    //   await _subscriptionRepository.DeleteSubscriptionAsync(subscription);

    //   // Save changes to the database
    //   await _subscriptionRepository.SaveChangesAsync();

    //   return true; // Subscription revoked successfully
    // }
  }
}
