namespace api.DTOs.Admin
{
    public class SubscriptionDto
    {
        public required string UserName { get; set; }
        public required string UserEmail { get; set; }
        public required int UserId { get; set; }
        public DateTime SubscriptionDate { get; set; }
    }
}
