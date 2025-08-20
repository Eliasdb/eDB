// Contracts/OrderCreatedV1.cs
namespace Edb.AdminAPI.Contracts;

public record OrderCreatedV1(
    string Id,
    string UserId,
    string Status,
    decimal Amount,
    string FullName,
    string Address,
    string City,
    string PostalCode,
    string Email,
    DateTimeOffset CreatedAt,
    Item[] Items,
    Meta Meta
);

public record Item(string BookId, string? BookName, decimal Price, int Quantity);

public record Meta(string Schema);
