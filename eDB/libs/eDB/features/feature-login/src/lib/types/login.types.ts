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

export interface LoginResponse {
  message: string;
  user: User;
  token: string;
}

export interface Credentials {
  email: string;
  password: string;
}
