export interface User {
  id?: number;
  email: string;
  password?: string; // Only required during registration
  firstName: string;
  lastName: string;
  country?: string; // Optional since it's not required for login
  state?: string;
  phoneNumber?: string;
  company?: string;
  role?: number; // User roles, e.g., Admin, User
}

export interface LinkItem {
  id: string;
  label: string;
  active?: boolean;
}

// user.model.ts
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
