import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { BehaviorSubject, firstValueFrom, map, Observable, of } from 'rxjs';

import { environment } from '@eDB/shared-env';
import { injectMutation } from '@tanstack/angular-query-experimental';
import {
  Credentials,
  LoginResponse,
  RegisterResponse,
} from './types/auth.model';
import { User } from './types/user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly tokenKey = 'token';
  isAuthenticatedSubject: BehaviorSubject<boolean>;

  constructor() {
    // Initialize the BehaviorSubject with the current authentication state
    const token = this.getToken();
    this.isAuthenticatedSubject = new BehaviorSubject<boolean>(token !== null);
  }

  http = inject(HttpClient);

  registerMutation() {
    return injectMutation<RegisterResponse, HttpErrorResponse, User>(() => ({
      mutationFn: async (user: User): Promise<RegisterResponse> => {
        return firstValueFrom(
          this.http.post<RegisterResponse>(
            `${environment.apiAuthUrl}/register`,
            user,
          ),
        );
      },
      // Optionally handle onSuccess
    }));
  }

  loginMutation() {
    return injectMutation<LoginResponse, HttpErrorResponse, Credentials>(
      () => ({
        mutationFn: async (
          credentials: Credentials,
        ): Promise<LoginResponse> => {
          // Use `firstValueFrom` to convert Observable to Promise
          return firstValueFrom(
            this.http.post<LoginResponse>(
              `${environment.apiAuthUrl}/login`,
              credentials,
            ),
          );
        },
      }),
    );
  }

  /**
   * Handles user login by setting the token in localStorage.
   * This method can be used in interceptors or other services if needed.
   */
  handleLogin(token: string): void {
    localStorage.setItem(this.tokenKey, token);
    this.isAuthenticatedSubject.next(true);
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
        ],
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

  isAuthenticated(): Observable<boolean> {
    return this.isAuthenticatedSubject.asObservable();
  }

  /**
   * Logs out the user by clearing the token.
   */
  logout(): void {
    localStorage.removeItem(this.tokenKey);
    this.isAuthenticatedSubject.next(false);
  }
}
