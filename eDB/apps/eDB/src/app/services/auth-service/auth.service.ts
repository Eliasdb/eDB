import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { firstValueFrom, map, Observable, of } from 'rxjs';

import { injectMutation } from '@tanstack/angular-query-experimental';
import {
  ErrorResponse,
  LoginResponse,
  RegisterResponse,
} from '../../models/auth.model';
import { User } from '../../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly baseUrl = 'http://localhost:9101/api/auth'; // Update to match your API URL
  private readonly tokenKey = 'token'; // Key for storing the token in localStorage

  http = inject(HttpClient);

  registerMutation() {
    return injectMutation<RegisterResponse, HttpErrorResponse, User>(() => ({
      mutationFn: async (user: User): Promise<RegisterResponse> => {
        // Use `firstValueFrom` to convert Observable to Promise
        return firstValueFrom(
          this.http.post<RegisterResponse>(`${this.baseUrl}/register`, user)
        );
      },
      // Optionally handle onSuccess or other mutation options here
    }));
  }

  /**
   * Handles user login.
   */
  login(credentials: {
    email: string;
    password: string;
  }): Observable<LoginResponse | ErrorResponse> {
    const url = `${this.baseUrl}/login`;
    return this.http.post<LoginResponse>(url, credentials);
  }

  /**
   * Gets the stored token.
   */
  private getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  /**
   * Decodes the JWT to extract user details.
   */
  private decodeToken(): any {
    const token = this.getToken();
    if (!token) return null;

    try {
      return jwtDecode(token);
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  }

  /**
   * Fetches the current user's role from the decoded token.
   */
  getUserRole(): Observable<string> {
    const decodedToken = this.decodeToken();
    if (
      decodedToken &&
      decodedToken[
        'http://schemas.microsoft.com/ws/2008/06/identity/claims/role'
      ]
    ) {
      return of(
        decodedToken[
          'http://schemas.microsoft.com/ws/2008/06/identity/claims/role'
        ]
      );
    }
    return of('User'); // Default role if no token or role is present
  }

  /**
   * Checks if the user is an admin.
   */
  isAdmin(): Observable<boolean> {
    return this.getUserRole().pipe(map((role) => role === 'Admin'));
  }

  /**
   * Logs out the user by clearing the token.
   */
  logout(): void {
    localStorage.removeItem(this.tokenKey);
  }
}
