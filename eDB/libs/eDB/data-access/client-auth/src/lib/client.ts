import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {
  BehaviorSubject,
  catchError,
  firstValueFrom,
  map,
  Observable,
  of,
} from 'rxjs';

import { environment } from '@eDB/shared-env';
import { injectMutation } from '@tanstack/angular-query-experimental';
import {
  Credentials,
  LoginResponse,
  RegisterResponse,
  User,
} from './types/auth.types';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  // Use boolean | null so that null means "unknown"
  public isAuthenticatedSubject = new BehaviorSubject<boolean>(false);

  http = inject(HttpClient);
  router = inject(Router);

  /**
   * Register Mutation
   */
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
    }));
  }

  /**
   * Checks if the user session is active.
   * Returns a Promise that resolves to true if authenticated, or false otherwise.
   */
  checkSessionPromise(): Promise<boolean> {
    return firstValueFrom<boolean>(
      this.http
        .get<any>(`${environment.apiAuthUrl}/session`, {
          withCredentials: true,
        })
        .pipe(
          map(() => {
            this.isAuthenticatedSubject.next(true);
            return true;
          }),
          catchError((error: HttpErrorResponse) => {
            this.isAuthenticatedSubject.next(false);
            return of(false);
          }),
        ),
    );
  }
  /**
   * Login Mutation
   */
  loginMutation() {
    return injectMutation<LoginResponse, HttpErrorResponse, Credentials>(
      () => ({
        mutationFn: async (
          credentials: Credentials,
        ): Promise<LoginResponse> => {
          return firstValueFrom(
            this.http.post<LoginResponse>(
              `${environment.apiAuthUrl}/login`,
              credentials,
              { withCredentials: true }, // Ensure credentials are sent with the request
            ),
          );
        },
      }),
    );
  }

  /**
   * Get the user's role from the backend instead of decoding a JWT.
   */
  getUserRole(): Observable<string> {
    return this.http
      .get<{ role: string }>(`${environment.apiAuthUrl}/role`)
      .pipe(
        map((response) => response.role),
        (error) => of('User'), // Default to 'User' if request fails
      );
  }

  /**
   * Check if the user is an admin.
   */
  isAdmin(): Observable<boolean> {
    return this.getUserRole().pipe(map((role) => role === 'Admin'));
  }

  /**
   * Check if the user is authenticated.
   */
  isAuthenticated(): Observable<boolean> {
    return this.isAuthenticatedSubject.asObservable();
  }
  /**
   * Logout user and clear session.
   */
  logout(): void {
    this.http
      .post(`${environment.apiAuthUrl}/logout`, {}, { withCredentials: true })
      .subscribe(() => {
        this.isAuthenticatedSubject.next(false);
        this.router.navigate(['/login']); // ✅ Navigates to login without full reload
      });
  }
}
