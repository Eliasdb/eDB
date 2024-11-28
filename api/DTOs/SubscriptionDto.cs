namespace api.DTOs
{
    public class ApplicationOverviewDto
    {
        public required string ApplicationName { get; set; }
        public required string ApplicationDescription { get; set; }
        public required int ApplicationId { get; set; } // Add ApplicationId
        public List<UserSubscriptionDto> SubscribedUsers { get; set; } = new();
    }

    public class UserSubscriptionDto
    {
        public required string UserName { get; set; }
        public required string UserEmail { get; set; }
        public required int UserId { get; set; } // Add UserId
        public DateTime SubscriptionDate { get; set; }
    }
}