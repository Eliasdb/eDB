import { HttpClient, HttpParams } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { environment } from '@eDB/shared-env';
import { injectQuery } from '@tanstack/angular-query-experimental';
import { firstValueFrom } from 'rxjs';
import { SubscribedApplication } from './types/dashboard.types';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  private http = inject(HttpClient);
  private search = signal('');
  private tag = signal('All apps');

  // Query result directly
  private queryResult = injectQuery(() => ({
    queryKey: ['subscriptions', this.search(), this.tag()],
    queryFn: async () => await firstValueFrom(this.fetchSubscriptions()),
    refetchOnWindowFocus: false,
    refetchOnMount: true,
  }));

  private tagsQueryResult = injectQuery(() => ({
    queryKey: ['subscription-tags'],
    queryFn: async () =>
      await firstValueFrom(
        this.http.get<string[]>(
          `${environment.apiBaseUrl}/applications/user/tags`,
        ),
      ),
    refetchOnWindowFocus: false,
    refetchOnMount: true,
  }));

  // Signals derived from queryResult
  subscriptions = computed(() => this.queryResult.data?.() ?? []);
  tags = computed(() => this.tagsQueryResult.data?.() ?? []);
  isLoading = computed(() => this.queryResult.isLoading?.());
  error = computed(() => this.queryResult.error?.()?.message || null);

  // Optional refetch method for manual refreshing
  refetchSubscriptions() {
    this.queryResult.refetch?.();
  }

  setFilters(search: string, tag: string) {
    this.search.set(search.trim());
    this.tag.set(tag || 'All apps');
    this.queryResult.refetch?.();
  }

  private fetchSubscriptions() {
    let params = new HttpParams();
    const search = this.search().trim();
    const tag = this.tag();

    if (search.length > 0) {
      params = params.set('search', search);
    }

    if (tag && tag !== 'All apps') {
      params = params.set('tag', tag);
    }

    return this.http.get<SubscribedApplication[]>(
      `${environment.apiBaseUrl}/applications/user`,
      { params },
    );
  }
}
