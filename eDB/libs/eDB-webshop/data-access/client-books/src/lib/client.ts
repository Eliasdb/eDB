import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { RawApiDataBook, RawApiDataBooks } from '@eDB-webshop/shared-types';
import { environment } from '@eDB/shared-env';

import {
  injectInfiniteQuery,
  injectQuery,
} from '@tanstack/angular-query-experimental';
import { firstValueFrom } from 'rxjs';
import {
  BookQueryParams,
  GENRE_QUERY_PARAM,
  SEARCH_QUERY_PARAM,
  SORT_QUERY_PARAM,
  STATUS_QUERY_PARAM,
} from './types/book-param.type';

@Injectable({
  providedIn: 'root',
})
export class BooksService {
  private http = inject(HttpClient);

  private queryParams = signal<Partial<BookQueryParams>>({});

  // Infinite query for offset-based pagination
  booksInfiniteQuery = injectInfiniteQuery<RawApiDataBooks, Error>(() => {
    const paramsSignal = this.queryParams();
    const status =
      paramsSignal.status && paramsSignal.status !== ''
        ? paramsSignal.status
        : 'available';

    // Build common query params
    let params = new HttpParams().set('status', status);
    if (paramsSignal.genre && paramsSignal.genre !== '') {
      params = params.set('genre', paramsSignal.genre as string);
    }
    if (paramsSignal.search && paramsSignal.search !== '') {
      params = params.set('search', paramsSignal.search as string);
    }
    if (paramsSignal.sort && paramsSignal.sort !== '') {
      params = params.set('sort', paramsSignal.sort as string);
    }

    // default to 15
    const limit = 15;
    params = params.set('limit', limit);

    return {
      queryKey: [
        'BOOKS_INFINITE',
        paramsSignal[GENRE_QUERY_PARAM],
        paramsSignal[SEARCH_QUERY_PARAM],
        paramsSignal[STATUS_QUERY_PARAM],
        paramsSignal[SORT_QUERY_PARAM],
      ] as const,
      // Note: No explicit type on the parameter; let the framework supply it.
      queryFn: async (context) => {
        const offset = (context.pageParam as number | null) ?? 0;
        const fullParams = params.set('offset', offset.toString());
        console.log('Fetching with params:', fullParams.toString());
        return await firstValueFrom(
          this.http.get<RawApiDataBooks>(`${environment.bookAPIUrl}/books`, {
            params: fullParams,
          }),
        );
      },
      getNextPageParam: (lastPage: RawApiDataBooks) => {
        if (lastPage.data.hasMore) {
          const currentOffset = Number(lastPage.data.offset) || 0;
          const pageLimit = Number(lastPage.data.limit) || limit;
          const nextOffset = currentOffset + pageLimit;
          console.log('Next offset:', nextOffset);
          return nextOffset;
        }
        return null;
      },

      initialPageParam: 0, // Start with offset 0
      keepPreviousData: true,
      refetchOnWindowFocus: false,
      refetchOnMount: true,
    };
  });

  // Computed total books count from the infinite query.
  // We assume that the API returns the same total count on each page,
  // so we use the first page's count.
  public totalBooksCount = computed(() => {
    const data = this.booksInfiniteQuery.data();
    return data && data.pages.length > 0 ? data.pages[0].data.count : 0;
  });

  /**
   * Updates the internal query parameters signal.
   * When these parameters are updated, both queryBooks and booksInfiniteQuery will refetch.
   */
  updateQueryBooks(newParams: Partial<BookQueryParams>) {
    this.queryParams.set(newParams);
    // Optionally, you can return queryBooks if you need to chain further actions.
  }

  // --- Query Books By Id ---
  // Create a signal to hold the currently selected book id.
  public selectedBookId = signal<number | null>(null);

  // Create a query that depends on the selectedBookId.
  // If selectedBookId() is null, the queryFn will throw an error.
  public queryBookById = injectQuery<RawApiDataBook, Error>(() => {
    const id = this.selectedBookId();

    return {
      queryKey: ['BOOKS', id] as const,
      queryFn: async () => {
        return await firstValueFrom(
          this.http.get<RawApiDataBook>(
            `${environment.bookAPIUrl}/books/${id}`,
          ),
        );
      },
      enabled: id !== null,
      refetchOnMount: true,
    };
  });

  // Update method to set the id signal.
  public updateSelectedBookId(id: number) {
    this.selectedBookId.set(id);
    return this.queryBookById;
  }
}
