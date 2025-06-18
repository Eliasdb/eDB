using AutoMapper;
using EDb.Domain.Entities;
using Edb.PlatformAPI.DTOs.Profile;

namespace Edb.PlatformAPI.Mapping;

public class MappingProfile : Profile
{
  public MappingProfile()
  {
    // Map User -> ProfileSettingsResponse
    CreateMap<User, ProfileSettingsResponse>();

    // Map ProfileUpdateRequest -> User
    CreateMap<ProfileUpdateRequest, User>()
      .ForAllMembers(opts => opts.Condition((src, dest, srcMember) => srcMember != null));
  }
}
