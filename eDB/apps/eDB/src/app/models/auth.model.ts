import { User } from './user.model';

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
  };
}

export interface Credentials {
  email: string;
  password: string;
}
