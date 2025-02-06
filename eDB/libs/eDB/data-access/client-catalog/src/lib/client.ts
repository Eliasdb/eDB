import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import {
  injectMutation,
  QueryClient,
} from '@tanstack/angular-query-experimental';
import { firstValueFrom } from 'rxjs';

import { environment } from '@eDB/shared-env';
import { CatalogItem } from './types/catalog.model';

@Injectable({
  providedIn: 'root',
})
export class CatalogService {
  // Signals for reactive state management
  catalog = signal<CatalogItem[] | null>(null);
  isLoading = signal<boolean>(true);
  error = signal<string | null>(null);

  http = inject(HttpClient);
  private queryClient = inject(QueryClient);

  constructor() {
    this.fetchCatalog();
  }

  fetchCatalog() {
    this.isLoading.set(true);
    this.error.set(null);

    this.http
      .get<CatalogItem[]>(`${environment.apiBaseUrl}/applications`)
      .subscribe({
        next: (data) => {
          if (data && data.length > 0) {
            this.catalog.set(data);
            this.error.set(null);
          } else {
            this.catalog.set(null);
            this.error.set('Catalog is empty');
          }
          this.isLoading.set(false);
        },
        error: (err) => {
          this.catalog.set(null);
          this.error.set('Error fetching catalog: ' + err.message);
          this.isLoading.set(false);
        },
      });
  }

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
        this.fetchCatalog();
        this.queryClient.invalidateQueries({ queryKey: ['subscriptions'] });
      },
      onError: (error: any) => {
        console.error('Failed to subscribe:', error);
      },
    }));
  }
}
