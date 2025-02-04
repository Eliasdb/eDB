using AutoMapper;
using EDb.Domain.Entities;
using PlatformAPI.DTOs.Admin;
using PlatformAPI.DTOs.Applications;
using PlatformAPI.DTOs.Auth;
using PlatformAPI.DTOs.Profile;

namespace PlatformAPI.Mapping;

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
            src.User != null ? $"{src.User.FirstName} {src.User.LastName}" : "Unknown User"
          )
      )
      .ForMember(
        dest => dest.UserEmail,
        opt => opt.MapFrom(src => src.User != null ? src.User.Email : "No Email")
      )
      .ForMember(dest => dest.SubscriptionDate, opt => opt.MapFrom(src => src.SubscriptionDate));

    CreateMap<Application, ApplicationOverviewDto>()
      .ForMember(dest => dest.ApplicationId, opt => opt.MapFrom(src => src.Id))
      .ForMember(dest => dest.ApplicationIconUrl, opt => opt.MapFrom(src => src.IconUrl))
      .ForMember(dest => dest.ApplicationRoutePath, opt => opt.MapFrom(src => src.RoutePath))
      .ForMember(dest => dest.ApplicationTags, opt => opt.MapFrom(src => src.Tags))
      .ForMember(dest => dest.ApplicationName, opt => opt.MapFrom(src => src.Name))
      .ForMember(dest => dest.ApplicationDescription, opt => opt.MapFrom(src => src.Description))
      .ForMember(
        dest => dest.SubscriberCount,
        opt => opt.MapFrom(src => src.Subscriptions.Count(sub => sub.User != null))
      )
      .ForMember(
        dest => dest.SubscribedUsers,
        opt => opt.MapFrom(src => src.Subscriptions.Where(sub => sub.User != null).ToList())
      );

    CreateMap<Application, ApplicationDto>();

    CreateMap<UpdateApplicationDto, Application>()
      .ForAllMembers(opts => opts.Condition((src, dest, srcMember) => srcMember != null));

    CreateMap<CreateApplicationDto, Application>();

    // Map User -> ProfileSettingsResponse
    CreateMap<User, ProfileSettingsResponse>();

    // Map ProfileUpdateRequest -> User
    CreateMap<ProfileUpdateRequest, User>()
      .ForAllMembers(opts => opts.Condition((src, dest, srcMember) => srcMember != null));
  }
}
