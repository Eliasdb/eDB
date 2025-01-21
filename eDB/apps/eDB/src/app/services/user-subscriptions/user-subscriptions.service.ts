import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable } from '@angular/core';
import { SubscribedApplication } from '@eDB/platform-models/catalog.model';
import { injectQuery } from '@tanstack/angular-query-experimental';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UserSubscriptionsService {
  private http = inject(HttpClient);

  // Query result directly
  private queryResult = injectQuery(() => ({
    queryKey: ['subscriptions'],
    queryFn: async () =>
      await firstValueFrom(
        this.http.get<SubscribedApplication[]>(
          `${environment.apiBaseUrl}/applications/user`,
        ),
      ),
    refetchOnWindowFocus: false,
    refetchOnMount: true,
  }));

  // Signals derived from queryResult
  subscriptions = computed(() => this.queryResult.data?.() ?? []);
  isLoading = computed(() => this.queryResult.isLoading?.());
  error = computed(() => this.queryResult.error?.()?.message || null);

  // Optional refetch method for manual refreshing
  refetchSubscriptions() {
    this.queryResult.refetch?.();
  }
}
