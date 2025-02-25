import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { firstValueFrom, lastValueFrom } from 'rxjs';

import {
  injectMutation,
  injectQuery,
  QueryClient,
} from '@tanstack/angular-query-experimental';

import { environment } from '@eDB/shared-env';

import {
  Application,
  CreateApplicationDto,
  PaginatedResponse,
  UserProfile,
} from './types/admin.types';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  private http = inject(HttpClient);
  private queryClient = inject(QueryClient);

  // USER RELATED
  /**
   * Fetches users with given parameters.
   * @param cursor Cursor for pagination (represents the last User's sort field value).
   * @param searchParam Search query.
   * @param sortParam Sort parameters in the format "field,direction".
   * @returns Promise of PaginatedResponse.
   */
  async queryAllUsers(
    cursor: number | string | null,
    searchParam?: string,
    sortParam?: string,
  ): Promise<PaginatedResponse<UserProfile>> {
    let params = new HttpParams();

    if (cursor !== null && cursor !== undefined) {
      if (typeof cursor === 'string') {
        try {
          const parsedCursor = JSON.parse(cursor);

          if (
            typeof parsedCursor === 'object' &&
            parsedCursor.value !== undefined &&
            parsedCursor.id !== undefined
          ) {
            params = params.set('cursor', JSON.stringify(parsedCursor));
          } else {
            params = params.set('cursor', cursor); // Raw string fallback
          }
        } catch (error) {
          console.error('Failed to parse cursor:', error);
          params = params.set('cursor', cursor); // Fallback to original cursor
        }
      } else {
        params = params.set('cursor', cursor.toString()); // Convert numbers to string
      }
    }

    if (searchParam && searchParam.trim() !== '') {
      params = params.set('search', searchParam.trim());
    }

    if (sortParam && sortParam.trim() !== '') {
      const [sortField, sortDirection] = sortParam.split(',');
      const backendSortField = this.mapSortFieldToBackend(sortField);
      const backendSortParam = `${backendSortField},${sortDirection}`;
      params = params.set('sort', backendSortParam);
    }

    return lastValueFrom(
      this.http.get<PaginatedResponse<UserProfile>>(
        `${environment.apiAdminUrl}/users`,
        { params },
      ),
    );
  }

  queryUserById(userId: number) {
    const userSignal = signal<UserProfile | null>(null); // Initialize a signal
    injectQuery(() => ({
      queryKey: ['user', userId],
      queryFn: async () => {
        const user = await firstValueFrom(
          this.http.get<UserProfile>(
            `${environment.apiAdminUrl}/users/${userId}`,
          ),
        );
        if (!user) {
          throw new Error('User not found');
        }
        userSignal.set(user);
        return user;
      },
    }));
    return userSignal; // Return the signal
  }

  deleteUserMutation() {
    return injectMutation(() => ({
      mutationFn: async (userId: number) => {
        return firstValueFrom(
          this.http.delete<void>(`${environment.apiAdminUrl}/users/${userId}`),
        );
      },
      onSuccess: () => {
        this.queryClient.invalidateQueries({ queryKey: ['users'] });
      },
    }));
  }

  revokeSubscriptionMutation() {
    return injectMutation(() => ({
      mutationFn: async ({
        applicationId,
        userId,
      }: {
        applicationId: number;
        userId: number;
      }) => {
        return firstValueFrom(
          this.http.delete<void>(
            `${environment.apiAdminUrl}/applications/${applicationId}/subscriptions/${userId}`,
          ),
        );
      },
      onSuccess: () => {
        this.queryClient.invalidateQueries({ queryKey: ['applications'] });
      },
    }));
  }

  // APPLICATION RELATED

  queryApplications() {
    return injectQuery(() => ({
      queryKey: ['applications'],
      queryFn: async () => {
        const subscriptions = await firstValueFrom(
          this.http.get<Application[]>(
            `${environment.apiAdminUrl}/applications`,
          ),
        );
        if (!subscriptions) {
          throw new Error('Subscriptions not found');
        }
        return subscriptions;
      },
      refetchOnWindowFocus: false,
      refetchOnMount: false,
    }));
  }

  addApplicationMutation() {
    return injectMutation(() => ({
      mutationFn: async (application: CreateApplicationDto) => {
        return firstValueFrom(
          this.http.post(
            `${environment.apiAdminUrl}/applications/create`,
            application,
          ),
        );
      },
      onSuccess: () => {
        this.queryClient.invalidateQueries({ queryKey: ['applications'] });
      },
    }));
  }

  editApplicationMutation() {
    return injectMutation(() => ({
      mutationFn: async (application: Application) => {
        return firstValueFrom(
          this.http.put(
            `${environment.apiAdminUrl}/applications/${application.applicationId}`,
            application,
          ),
        );
      },
      onSuccess: () => {
        this.queryClient.invalidateQueries({ queryKey: ['applications'] });
      },
    }));
  }

  deleteApplicationMutation() {
    return injectMutation(() => ({
      mutationFn: async (applicationId: number) => {
        return firstValueFrom(
          this.http.delete<void>(
            `${environment.apiAdminUrl}/applications/${applicationId}`,
          ),
        );
      },
      onSuccess: () => {
        this.queryClient.invalidateQueries({ queryKey: ['applications'] });
      },
    }));
  }

  /**
   * Maps frontend sortField to backend sortField.
   * @param sortField Frontend sort field.
   * @returns Backend sort field.
   */
  public mapSortFieldToBackend(sortField: string): keyof UserProfile {
    const fieldMapping: { [key: string]: keyof UserProfile } = {
      firstname: 'firstName',
      lastname: 'lastName',
      email: 'email',
      role: 'role',
      state: 'state',
      id: 'id',
    };
    return fieldMapping[sortField.toLowerCase()] || 'id';
  }
}
