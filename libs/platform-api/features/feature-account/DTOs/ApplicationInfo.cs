// ─────────────────────────────────────────────────────────────────────────────
// DTOs/ApplicationInfo.cs
// ─────────────────────────────────────────────────────────────────────────────
namespace Edb.FeatureAccount.DTOs;

public class ApplicationInfo
{
  public string Name { get; set; } = string.Empty;
  public string ClientId { get; set; } = string.Empty;
  public string Url { get; set; } = string.Empty;
  public string Type { get; set; } = string.Empty;
  public string Status { get; set; } = string.Empty;
}
