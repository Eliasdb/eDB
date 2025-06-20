using AutoMapper;
using EDb.Domain.Entities;
using Edb.FeatureAccount.DTOs;

namespace Edb.FeatureAccount.Mapping;

public class AccountMappingProfile : Profile
{
  public AccountMappingProfile()
  {
    // Map User -> ProfileSettingsResponse
    CreateMap<User, ProfileSettingsResponse>();

    // Map ProfileUpdateRequest -> User
    CreateMap<AccountUpdateRequest, User>()
      .ForAllMembers(opts => opts.Condition((src, dest, srcMember) => srcMember != null));
  }
}
