import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import {
  injectMutation,
  injectQuery,
  QueryClient,
} from '@tanstack/angular-query-experimental';
import { firstValueFrom } from 'rxjs';
import { UserProfile } from '../../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class UserProfileService {
  private readonly apiUrl = 'http://localhost:9101/api/profile/settings';
  private readonly apiUrl2 = 'http://localhost:9101/api/profile/update';

  private queryClient = inject(QueryClient);
  private http = inject(HttpClient);

  // Fetch user profile
  fetchUserProfile() {
    return injectQuery(() => ({
      queryKey: ['userProfile'],
      queryFn: async () => {
        const profile = await firstValueFrom(
          this.http.get<UserProfile>(this.apiUrl)
        );
        if (!profile) {
          throw new Error('User profile not found');
        }
        return profile;
      },

      staleTime: 300000, // 5 minutes
    }));
  }

  // Update user profile
  updateUserProfile() {
    return injectMutation(() => ({
      mutationFn: async (updatedData: Partial<UserProfile>) => {
        const updatedProfile = await firstValueFrom(
          this.http.put<UserProfile>(this.apiUrl2, updatedData)
        );
        if (!updatedProfile) {
          throw new Error('Failed to update user profile');
        }
        return updatedProfile;
      },
      onSuccess: () => {
        // Invalidate the `userProfile` query to refresh data
        this.queryClient.invalidateQueries({ queryKey: ['userProfile'] });
      },
    }));
  }
}
