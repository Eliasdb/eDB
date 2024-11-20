export interface User {
  id?: number;
  email: string;
  password?: string; // Only required during registration
  firstName: string;
  lastName: string;
  country?: string; // Optional since it's not required for login
  state?: string;
  company?: string;
  role?: number; // User roles, e.g., Admin, User
}
