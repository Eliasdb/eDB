namespace Edb.AdminAPI.DTOs;

public class PagedUserResult<T>
{
  public List<T> Data { get; set; } = [];
  public bool HasMore { get; set; }
  public object? NextCursor { get; set; }
}
