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
