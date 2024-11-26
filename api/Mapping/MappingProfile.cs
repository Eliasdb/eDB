// MappingProfiles/UserMappingProfile.cs
using AutoMapper;
using api.Models;
using api.DTOs;

namespace api.Mapping
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            // Mapping from User entity to UserDto
            CreateMap<User, UserDto>()
                .ForMember(dest => dest.Role, opt => opt.MapFrom(src => src.Role));

            CreateMap(typeof(PagedResult<>), typeof(PagedResult<>))
                .ConvertUsing(typeof(PagedResultConverter<,>));
        }
    }
}
