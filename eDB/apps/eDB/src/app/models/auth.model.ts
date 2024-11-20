import { User } from './user.model';

export interface AuthResponse {
  message: string;
  token?: string;
  user: User;
}

export interface ErrorResponse {
  error?: string; // Error type, e.g., 'InvalidCredentials'
  message: string; // Human-readable message
  status?: number; // HTTP status code
  traceId?: string; // Optional trace ID for debugging
  errors?: Record<string, string[]>; // Validation errors
}
