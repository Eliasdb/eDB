import { HttpClient, HttpParams } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { environment } from '@eDB/shared-env';
import { injectInfiniteQuery } from '@tanstack/angular-query-experimental';
import { firstValueFrom } from 'rxjs';
import { AiSearchResponse } from '../types/ai-search';

@Injectable({ providedIn: 'root' })
export class AiSearchService {
  private http = inject(HttpClient);

  /** Natural language query the user typed */
  readonly nlQuery = signal<string>('');

  /** Page size */
  readonly limit = 15;

  /** Infinite query over the AI endpoint */
  readonly aiInfiniteQuery = injectInfiniteQuery<AiSearchResponse, Error>(
    () => {
      const q = this.nlQuery().trim();

      return {
        queryKey: ['AI_SEARCH', q] as const,
        enabled: !!q, // <-- valid here (options object)
        initialPageParam: 0,
        queryFn: async ({ pageParam }) => {
          const offset = (pageParam as number) ?? 0;

          const body = { query: q };
          const params = new HttpParams()
            .set('offset', offset)
            .set('limit', this.limit.toString());

          return await firstValueFrom(
            this.http.post<AiSearchResponse>(
              `${environment.bookAPIUrl}/search/books`,
              body,
              { params },
            ),
          );
        },
        getNextPageParam: (last) => {
          if (last.hasMore) {
            const off = Number(last.offset ?? 0);
            const lim = Number(last.limit ?? this.limit);
            return off + lim;
          }
          return undefined;
        },
        refetchOnWindowFocus: false,
      };
    },
  );

  run(q: string) {
    this.nlQuery.set(q);
    // re-run with new key
    this.aiInfiniteQuery.refetch();
  }

  /** convenience derived signals */
  readonly data = computed(() => this.aiInfiniteQuery.data()?.pages ?? []);
  readonly flatItems = computed(() =>
    this.data().flatMap((p) => p.items ?? []),
  );
  readonly firstPage = computed(() => this.data()[0]);
  readonly isLoading = this.aiInfiniteQuery.isLoading;
  readonly isFetchingNextPage = this.aiInfiniteQuery.isFetchingNextPage;
  readonly error = this.aiInfiniteQuery.error;
  readonly hasMore = computed(() => {
    const last = this.data()[this.data().length - 1];
    return last?.hasMore ?? false;
  });
}
