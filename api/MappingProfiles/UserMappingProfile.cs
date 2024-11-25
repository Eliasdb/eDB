// MappingProfiles/UserMappingProfile.cs
using AutoMapper;
using api.Models;
using api.Models.DTOs;

namespace api.MappingProfiles
{
    public class UserMappingProfile : Profile
    {
        public UserMappingProfile()
        {
            // Mapping from User entity to UserDto
            CreateMap<User, UserDto>()
                .ForMember(dest => dest.Role, opt => opt.MapFrom(src => src.Role));

            // If you have other entities, map them here
            // Example:
            // CreateMap<Product, ProductDto>();
        }
    }
}
