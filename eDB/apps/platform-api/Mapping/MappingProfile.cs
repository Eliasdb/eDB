using AutoMapper;
using EDb.Domain.Entities;
using Edb.PlatformAPI.DTOs.Admin;
using Edb.PlatformAPI.DTOs.Profile;

namespace Edb.PlatformAPI.Mapping;

public class MappingProfile : Profile
{
  public MappingProfile()
  {
    // Mapping from User entity to UserDto remains if you still use local User records for some scenarios.
    // CreateMap<User, UserDto>()
    //   .ForMember(dest => dest.Role, opt => opt.MapFrom(src => src.Role));

    // Generic mapping for PagedResult<>
    CreateMap(typeof(PagedUserResult<>), typeof(PagedUserResult<>))
      .ConvertUsing(typeof(PagedResultConverter<,>));

    // Updated mapping from Subscription to SubscriptionDto.
    // Since there's no local User, map the KeycloakUserId or use placeholders.
    CreateMap<Subscription, SubscriptionDto>()
      .ForMember(
        dest => dest.UserName,
        opt => opt.MapFrom(src => src.KeycloakUserId) // Using KeycloakUserId as a fallback identifier
      )
      .ForMember(
        dest => dest.UserEmail,
        opt => opt.Ignore() // Or use a placeholder since email isn't available locally
      )
      .ForMember(dest => dest.SubscriptionDate, opt => opt.MapFrom(src => src.SubscriptionDate));

    // Updated mapping for Application to ApplicationOverviewDto.
    // Remove conditions based on a local User reference.
    CreateMap<Application, ApplicationOverviewDto>()
      .ForMember(dest => dest.ApplicationId, opt => opt.MapFrom(src => src.Id))
      .ForMember(dest => dest.ApplicationIconUrl, opt => opt.MapFrom(src => src.IconUrl))
      .ForMember(dest => dest.ApplicationRoutePath, opt => opt.MapFrom(src => src.RoutePath))
      .ForMember(dest => dest.ApplicationTags, opt => opt.MapFrom(src => src.Tags))
      .ForMember(dest => dest.ApplicationName, opt => opt.MapFrom(src => src.Name))
      .ForMember(dest => dest.ApplicationDescription, opt => opt.MapFrom(src => src.Description))
      // Count subscriptions directly since we no longer check for sub.User != null.
      .ForMember(dest => dest.SubscriberCount, opt => opt.MapFrom(src => src.Subscriptions.Count))
      // Map the subscriptions collection directly.
      .ForMember(dest => dest.SubscribedUsers, opt => opt.MapFrom(src => src.Subscriptions));

    // The rest of your mappings remain unchanged.
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
