using api.DTOs.Admin;
using api.DTOs.Auth;
using api.Models;
using AutoMapper;

namespace api.Mapping
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            // Mapping from User entity to UserDto
            CreateMap<User, UserDto>()
                .ForMember(dest => dest.Role, opt => opt.MapFrom(src => src.Role));

            CreateMap<RegisterRequest, User>();

            // Generic mapping for PagedResult<>
            CreateMap(typeof(PagedUserResult<>), typeof(PagedUserResult<>))
                .ConvertUsing(typeof(PagedResultConverter<,>));

            // Mapping from Subscription to UserSubscriptionDto
            CreateMap<Subscription, SubscriptionDto>()
                .ForMember(
                    dest => dest.UserName,
                    opt =>
                        opt.MapFrom(src =>
                            src.User != null
                                ? $"{src.User.FirstName} {src.User.LastName}"
                                : "Unknown User"
                        )
                )
                .ForMember(
                    dest => dest.UserEmail,
                    opt => opt.MapFrom(src => src.User != null ? src.User.Email : "No Email")
                )
                .ForMember(
                    dest => dest.SubscriptionDate,
                    opt => opt.MapFrom(src => src.SubscriptionDate)
                );

            // Map Application to ApplicationOverviewDto
            CreateMap<Application, ApplicationOverviewDto>()
                .ForMember(dest => dest.ApplicationName, opt => opt.MapFrom(src => src.Name))
                .ForMember(
                    dest => dest.ApplicationDescription,
                    opt => opt.MapFrom(src => src.Description)
                );

            CreateMap<Application, ApplicationDto>();

            CreateMap<UpdateApplicationDto, Application>()
                .ForAllMembers(opts => opts.Condition((src, dest, srcMember) => srcMember != null));

            CreateMap<CreateApplicationDto, Application>();
        }
    }
}
