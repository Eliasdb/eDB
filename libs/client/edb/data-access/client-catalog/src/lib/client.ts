import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable } from '@angular/core';
import {
  injectMutation,
  injectQuery,
  QueryClient,
} from '@tanstack/angular-query-experimental';
import { firstValueFrom } from 'rxjs';

import { environment } from '@eDB/shared-env';
import { CatalogItem } from './types/catalog.types';

@Injectable({
  providedIn: 'root',
})
export class CatalogService {
  http = inject(HttpClient);
  private queryClient = inject(QueryClient);

  private queryResult = injectQuery(() => ({
    queryKey: ['catalog'],
    queryFn: async () =>
      await firstValueFrom(
        this.http.get<CatalogItem[]>(`${environment.apiBaseUrl}/applications`),
      ),
    refetchOnWindowFocus: false,
    refetchOnMount: true,
  }));

  catalog = computed(() => this.queryResult.data?.() || []);
  isLoading = computed(() => this.queryResult.isLoading?.());
  error = computed(() => this.queryResult.error?.()?.message || null);

  subscribeToApplicationMutation() {
    return injectMutation(() => ({
      mutationFn: async (applicationId: number) => {
        return firstValueFrom(
          this.http.post(`${environment.apiBaseUrl}/applications/subscribe`, {
            applicationId,
          }),
        );
      },
      onSuccess: () => {
        // Optionally, refetch the catalog or update the state
        this.queryClient.invalidateQueries({ queryKey: ['subscriptions'] });
        this.queryClient.invalidateQueries({ queryKey: ['catalog'] });
      },
      onError: (error: unknown) => {
        console.error('Failed to subscribe:', error);
      },
    }));
  }
}
