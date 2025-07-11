export interface SubscribedUserDto {
  userName: string;
  userEmail: string;
  userId: number;
  subscriptionDate: string;
}

export interface Application {
  name: string;
  description: string;
  id: number;
  routePath: string;
  tags: string[];
  iconUrl: string;
  subscribedUsers: SubscribedUserDto[];
  subscriberCount: number;
}

export interface CreateApplicationDto {
  name: string;
  description: string;
  iconUrl: string;
  tags: string[];
  routePath: string;
}

export interface UserProfile {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  country: string;
  state: string;
  company: string;
  phoneNumber?: string;
  displayName: string;
  preferredLanguage: string;
  title: string;
  role: string; // e.g., 'user', 'admin'
  address: string;
}

export interface PaginatedResponse<T> {
  currentPage: number;
  data: T[];
  nextCursor: number | null; // Null if there are no more pages
  hasMore: boolean;
}

export interface AdminStats {
  data: {
    userCount: number;
    bookCount: number;
    loanedBooksCount: number;
  };
}
