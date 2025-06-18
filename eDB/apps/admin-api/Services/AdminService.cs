using System.Linq.Dynamic.Core;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Edb.AdminAPI.DTOs;
using Edb.AdminAPI.Interfaces;
using Edb.AdminAPI.Utilities;
using EDb.Domain.Entities;
using EDb.Domain.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Edb.AdminAPI.Services
{
  public class AdminService(
    KeycloakDbContext keycloakContext,
    IApplicationRepository applicationRepository,
    ISubscriptionRepository subscriptionRepository,
    IMapper mapper
  ) : IAdminService
  {
    // private readonly IUserRepository _userRepository = userRepository;
    private readonly KeycloakDbContext _keycloakContext = keycloakContext;

    private readonly IApplicationRepository _applicationRepository = applicationRepository;
    private readonly ISubscriptionRepository _subscriptionRepository = subscriptionRepository;
    private readonly IMapper _mapper = mapper;

    public async Task<PagedUserResult<UserDto>> GetUsersAsync(
      string? search,
      string? cursor,
      string sort,
      int pageSize = 15
    )
    {
      var allowedSortFields = new List<string>
      {
        "id",
        "username",
        "email",
        "first_name",
        "last_name",
      };
      var fieldMapping = new Dictionary<string, string>
      {
        { "id", "id" },
        { "username", "username" },
        { "email", "email" },
        { "firstName", "first_name" },
        { "lastName", "last_name" },
      };

      var (sortField, sortDirection) = QueryUtils.ParseSortParameter(sort, fieldMapping);

      var query = _keycloakContext.Users.AsQueryable();

      if (!string.IsNullOrWhiteSpace(search))
      {
        var pattern = $"%{search}%";
        query = query.Where(u =>
          EF.Functions.ILike(u.username ?? "", pattern)
          || EF.Functions.ILike(u.email ?? "", pattern)
          || EF.Functions.ILike(u.first_name ?? "", pattern)
          || EF.Functions.ILike(u.last_name ?? "", pattern)
        );
      }

      query = QueryUtils.ApplySorting(query, sortField, sortDirection, allowedSortFields);

      if (cursor != null)
      {
        if (sortDirection == "asc")
          query = query.Where($"{sortField} > @0", cursor);
        else
          query = query.Where($"{sortField} < @0", cursor);
      }

      var users = await query
        .Take(pageSize)
        .Select(u => new UserDto
        {
          Id = u.id,
          Username = u.username,
          Email = u.email,
          FirstName = u.first_name,
          LastName = u.last_name,
          EmailVerified = u.email_verified,
        })
        .ToListAsync();

      var (hasMore, nextCursor) = QueryUtils.DetermineNextCursor(users, sortField, sortDirection);

      return new PagedUserResult<UserDto>
      {
        Data = users,
        NextCursor = nextCursor,
        HasMore = hasMore,
      };
    }

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
