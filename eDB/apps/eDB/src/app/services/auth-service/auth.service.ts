import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { firstValueFrom, map, Observable, of } from 'rxjs';

import { injectMutation } from '@tanstack/angular-query-experimental';
import { AuthResponse, ErrorResponse } from '../../models/auth.model';
import { User } from '../../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly baseUrl = 'http://localhost:9101/api/auth'; // Update to match your API URL
  private readonly tokenKey = 'token'; // Key for storing the token in localStorage

  http = inject(HttpClient);

  /**
   * Handles user registration.
   */
  register(payload: User): Observable<AuthResponse | ErrorResponse> {
    const url = `${this.baseUrl}/register`;
    return this.http.post<AuthResponse>(url, payload);
  }

  registerMutation() {
    return injectMutation(() => ({
      mutationFn: async (user: User) => {
        // Use `firstValueFrom` to convert Observable to Promise
        return firstValueFrom(this.http.post(`${this.baseUrl}/register`, user));
      },
      // onSuccess: () => {
      //   // Optionally invalidate related queries
      //   this.queryClient.invalidateQueries({ queryKey: ['users'] });
      // },
    }));
  }

  /**
   * Handles user login.
   */
  login(credentials: {
    email: string;
    password: string;
  }): Observable<AuthResponse | ErrorResponse> {
    const url = `${this.baseUrl}/login`;
    return this.http.post<AuthResponse>(url, credentials);
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
