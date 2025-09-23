using System.Linq.Dynamic.Core;
using AutoMapper;
using Edb.AdminAPI.DTOs;
using Edb.AdminAPI.DTOs.Admin;
using Edb.AdminAPI.Interfaces;
using Edb.AdminAPI.Utilities;
using EDb.DataAccess.Data;
using EDb.Domain.Entities.Platform;
using EDb.Domain.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Edb.AdminAPI.Services
{
    public class AdminService(
        MyDbContext db,
        IApplicationRepository applicationRepository,
        IMapper mapper
    ) : IAdminService
    {
        private readonly MyDbContext _db = db;
        private readonly IApplicationRepository _applicationRepository = applicationRepository;
        private readonly IMapper _mapper = mapper;

        public async Task<PagedUserResult<UserDto>> GetUsersAsync(
            string? search,
            string? cursor,
            string sort,
            int pageSize = 15
        )
        {
            // Projection fields/columns
            var allowedSortFields = new List<string>
            {
                "Id",
                "Username",
                "Email",
                "FirstName",
                "LastName",
                "EmailVerified",
                "SyncedAt",
            };

            // map incoming sort keys (camelCase from UI) to entity props
            var fieldMapping = new Dictionary<string, string>(StringComparer.OrdinalIgnoreCase)
            {
                { "id", "Id" },
                { "username", "Username" },
                { "email", "Email" },
                { "firstName", "FirstName" },
                { "lastName", "LastName" },
                { "emailVerified", "EmailVerified" },
                { "syncedAt", "SyncedAt" },
            };

            var (sortField, sortDirection) = QueryUtils.ParseSortParameter(sort, fieldMapping);
            if (!allowedSortFields.Contains(sortField))
                (sortField, sortDirection) = ("Id", "asc");

            var query = _db.KeycloakUsers.AsNoTracking().Where(u => !u.IsDeleted); // hide soft-deleted by default

            if (!string.IsNullOrWhiteSpace(search))
            {
                var pattern = $"%{search}%";
                query = query.Where(u =>
                    EF.Functions.ILike(u.Username ?? "", pattern)
                    || EF.Functions.ILike(u.Email ?? "", pattern)
                    || EF.Functions.ILike(u.FirstName ?? "", pattern)
                    || EF.Functions.ILike(u.LastName ?? "", pattern)
                );
            }

            // keyset-ish cursor (cursor is the sort field value as string)
            if (!string.IsNullOrWhiteSpace(cursor))
            {
                // naive cursor handling: treat cursor as string comparand
                // For better keyset, pair with Id as tiebreaker or encode a composite cursor.
                var op = sortDirection.Equals("asc", StringComparison.OrdinalIgnoreCase)
                    ? ">"
                    : "<";
                query = query.Where($"{sortField} {op} @0", cursor);
            }

            // dynamic sort (then by Id to stabilize)
            query = query.OrderBy($"{sortField} {sortDirection}, Id asc");

            var users = await query
                .Take(pageSize)
                .Select(u => new UserDto
                {
                    Id = u.Id.ToString(), // adapt to your DTO shape
                    Username = u.Username ?? "",
                    Email = u.Email ?? "",
                    FirstName = u.FirstName ?? "",
                    LastName = u.LastName ?? "",
                    EmailVerified = u.EmailVerified,
                })
                .ToListAsync();

            // compute next cursor from the last item’s sort field
            var nextCursor =
                users.Count == pageSize
                    ? (
                        sortField switch
                        {
                            "Username" => users.Last().Username,
                            "Email" => users.Last().Email,
                            "FirstName" => users.Last().FirstName,
                            "LastName" => users.Last().LastName,
                            "EmailVerified" => users.Last().EmailVerified.ToString(),
                            _ => users.Last().Id, // fallback
                        }
                    )
                    : null;

            return new PagedUserResult<UserDto>
            {
                Data = users,
                NextCursor = nextCursor,
                HasMore = nextCursor != null,
            };
        }

        public async Task<List<ApplicationOverviewDto>> GetApplicationsWithSubscribersAsync()
        {
            var applications = await _applicationRepository.GetApplicationsAsync();
            return _mapper.Map<List<ApplicationOverviewDto>>(applications);
        }

        public async Task<Application> AddApplicationAsync(CreateApplicationDto applicationDto)
        {
            var application = _mapper.Map<Application>(applicationDto);
            await _applicationRepository.AddApplicationAsync(application);
            await _applicationRepository.SaveChangesAsync();
            return application;
        }

        public async Task<Application?> UpdateApplicationAsync(
            int applicationId,
            UpdateApplicationDto applicationDto
        )
        {
            var application = await _applicationRepository.GetByIdAsync(applicationId);
            if (application is null)
                return null;

            _mapper.Map(applicationDto, application);
            await _applicationRepository.UpdateApplicationAsync(application);
            await _applicationRepository.SaveChangesAsync();
            return application;
        }

        public async Task<bool> DeleteApplicationAsync(int applicationId)
        {
            var application = await _applicationRepository.GetByIdAsync(applicationId);
            if (application is null)
                return false;

            await _applicationRepository.DeleteApplicationAsync(application);
            await _applicationRepository.SaveChangesAsync();
            return true;
        }
    }
}
