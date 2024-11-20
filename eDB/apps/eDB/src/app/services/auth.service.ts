import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthResponse, ErrorResponse } from '../models/auth.model';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly baseUrl = 'http://localhost:9101/api/auth'; // Update to match your API URL

  http = inject(HttpClient);
  /**
   * Handles user registration.
   * @param payload The registration data.
   * @returns Observable for the HTTP response.
   */
  register(payload: User): Observable<AuthResponse | ErrorResponse> {
    const url = `${this.baseUrl}/register`;
    return this.http.post<AuthResponse>(url, payload);
  }

  /**
   * Handles user login.
   * @param credentials The login data.
   * @returns Observable for the HTTP response.
   */
  login(credentials: {
    email: string;
    password: string;
  }): Observable<AuthResponse | ErrorResponse> {
    const url = `${this.baseUrl}/login`;
    return this.http.post<AuthResponse>(url, credentials);
  }

  getLoggedInUser(): any {
    const token = localStorage.getItem('token');
    if (!token) return null;

    try {
      return; // Returns the decoded token payload
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  }
}
