// UserProfileService

import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@eDB/shared-env';
import {
  injectMutation,
  injectQuery,
  QueryClient,
} from '@tanstack/angular-query-experimental';
import { firstValueFrom } from 'rxjs';
import { UserProfile } from './types/user.model';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  private queryClient = inject(QueryClient);
  private http = inject(HttpClient);

  // Fetch user profile
  fetchUserProfile() {
    return injectQuery(() => ({
      queryKey: ['userProfile'],
      queryFn: async () => {
        const profile = await firstValueFrom(
          this.http.get<UserProfile>(
            `${environment.apiBaseUrl}/profile/settings`,
          ),
        );
        if (!profile) {
          throw new Error('User profile not found');
        }
        return profile;
      },
    }));
  }

  // Update user profile
  updateUserProfile() {
    return injectMutation(() => ({
      mutationFn: async (updatedData: Partial<UserProfile>) => {
        const updatedProfile = await firstValueFrom(
          this.http.put<UserProfile>(
            `${environment.apiBaseUrl}/profile/update`,
            updatedData,
          ),
        );
        if (!updatedProfile) {
          throw new Error('Failed to update user profile');
        }
        return updatedProfile;
      },
      onSuccess: () => {
        this.queryClient.invalidateQueries({ queryKey: ['userProfile'] });
      },
    }));
  }
}
