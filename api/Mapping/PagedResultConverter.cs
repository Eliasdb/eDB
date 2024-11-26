// Mapping/PagedResultConverter.cs
using AutoMapper;
using api.DTOs;

namespace api.Mapping
{
    public class PagedResultConverter<TSource, TDestination> : ITypeConverter<PagedResult<TSource>, PagedResult<TDestination>>
    {
        public PagedResult<TDestination> Convert(PagedResult<TSource> source, PagedResult<TDestination> destination, ResolutionContext context)
        {
            if (source == null)
                return new PagedResult<TDestination>();

            var mappedItems = context.Mapper.Map<List<TDestination>>(source.Items);

            return new PagedResult<TDestination>
            {
                Items = mappedItems,
                HasMore = source.HasMore,
                PageNumber = source.PageNumber,
                PageSize = source.PageSize,
                TotalCount = source.TotalCount
            };
        }
    }
}
