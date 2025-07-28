using System.Linq.Dynamic.Core;
using Edb.AdminAPI.DTOs;

namespace Edb.AdminAPI.Utilities;

public static class QueryUtils
{
  public static (bool hasMore, object? nextCursor) DetermineNextCursor(
    List<UserDto> users,
    string sortField,
    string sortDirection
  )
  {
    var hasMore = users.Count == 15;
    object? nextCursor = null;

    if (hasMore)
    {
      // Choose the last or first user based on sort direction
      var referenceUser = sortDirection == "asc" ? users.Last() : users.First();
      nextCursor = referenceUser?.GetType().GetProperty(sortField)?.GetValue(referenceUser);
    }

    return (hasMore, nextCursor);
  }

  public static IQueryable<T> ApplySorting<T>(
    IQueryable<T> query,
    string sortField,
    string sortDirection,
    List<string> allowedSortFields
  )
  {
    if (!allowedSortFields.Contains(sortField, StringComparer.OrdinalIgnoreCase))
    {
      Console.WriteLine($"Invalid sort field: {sortField}. Defaulting to Id.");
      sortField = "Id"; // Default to Id if field is invalid
    }

    var sorting = $"{sortField} {sortDirection}";
    Console.WriteLine($"Applying sorting: {sorting}");
    return query.OrderBy(sorting);
  }

  public static (string sortField, string sortDirection) ParseSortParameter(
    string? sort,
    Dictionary<string, string> fieldMapping
  )
  {
    if (string.IsNullOrWhiteSpace(sort))
    {
      return ("Id", "asc"); // Default sorting
    }

    var sortParts = sort.Split(',');
    var sortField = sortParts.Length > 0 ? sortParts[0] : "id";
    var sortDirection = sortParts.Length > 1 ? sortParts[1].ToLower() : "asc";

    if (!fieldMapping.TryGetValue(sortField, out var mappedField))
    {
      Console.WriteLine($"Invalid sort field: {sortField}. Defaulting to Id.");
      mappedField = "Id"; // Default to Id if field is invalid
    }

    if (sortDirection != "asc" && sortDirection != "desc")
    {
      sortDirection = "asc";
    }

    return (mappedField, sortDirection);
  }
}
