import { User } from './user.model';

// auth.model.ts
export interface RegisterResponse {
  message: string;
  user: User;
}

export interface LoginResponse {
  message: string;
  user: User;
  token: string;
}

export interface ErrorResponse {
  error: {
    message: string;
    // Add other properties if necessary
  };
}

export interface Credentials {
  email: string;
  password: string;
}
