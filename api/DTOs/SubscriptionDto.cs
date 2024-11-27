namespace api.DTOs
{
    public class ApplicationOverviewDto
    {
        public required string ApplicationName { get; set; }
        public required string ApplicationDescription { get; set; }
        public List<UserSubscriptionDto> SubscribedUsers { get; set; } = new();
    }

    public class UserSubscriptionDto
    {
        public required string UserName { get; set; }
        public required string UserEmail { get; set; }
        public DateTime SubscriptionDate { get; set; }
    }
}
