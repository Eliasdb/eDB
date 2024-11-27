export interface SubscribedUserDto {
  userName: string;
  userEmail: string;
  subscriptionDate: string;
}

export interface ApplicationOverviewDto {
  applicationName: string;
  applicationDescription: string;
  subscribedUsers: SubscribedUserDto[];
}
