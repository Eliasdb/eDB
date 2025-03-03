using AutoMapper;
using EDb.Domain.Entities;
using EDb.FeatureAuth.DTOs;

namespace EDb.FeatureAuth.Mapping;

public class AuthMappingProfile : Profile
{
  public AuthMappingProfile()
  {
    CreateMap<RegisterRequest, User>();
    CreateMap<User, UserDto>().ForMember(dest => dest.Role, opt => opt.MapFrom(src => src.Role));
  }
}
