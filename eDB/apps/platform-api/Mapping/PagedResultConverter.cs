using AutoMapper;
using Edb.PlatformAPI.DTOs.Admin;

namespace Edb.PlatformAPI.Mapping;

public class PagedResultConverter<TSource, TDestination>
  : ITypeConverter<PagedUserResult<TSource>, PagedUserResult<TDestination>>
{
  public PagedUserResult<TDestination> Convert(
    PagedUserResult<TSource> source,
    PagedUserResult<TDestination> destination,
    ResolutionContext context
  )
  {
    if (source == null)
      return new PagedUserResult<TDestination>();

    var mappedItems = context.Mapper.Map<List<TDestination>>(source.Data);

    return new PagedUserResult<TDestination>
    {
      Data = mappedItems,
      HasMore = source.HasMore,
      NextCursor = source.NextCursor,
    };
  }
}
