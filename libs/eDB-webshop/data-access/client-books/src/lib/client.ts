import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { RawApiDataBook, RawApiDataBooks } from '@eDB-webshop/shared-types';
import { environment } from '@eDB/shared-env';

import {
  injectInfiniteQuery,
  injectQuery,
} from '@tanstack/angular-query-experimental';
import { firstValueFrom } from 'rxjs';

import { BookParamService } from '@eDB-webshop/util-book-params';

@Injectable({
  providedIn: 'root',
})
export class BooksService {
  private http = inject(HttpClient);
  private bookParamService = inject(BookParamService);

  booksInfiniteQuery = injectInfiniteQuery<RawApiDataBooks, Error>(() => {
    const search = this.bookParamService.querySignal();
    const genre = this.bookParamService.genreSignal();
    const status = this.bookParamService.statusSignal();
    const sort = this.bookParamService.sortSignal();

    // Build common query params
    let params = new HttpParams().set('status', status || 'available');

    if (genre) {
      params = params.set('genre', genre);
    }
    if (search) {
      params = params.set('searchFilter', search);
    }
    if (sort) {
      params = params.set('sort', sort);
    }

    // default to 15
    const limit = 15;
    params = params.set('limit', limit.toString());

    return {
      queryKey: ['BOOKS_INFINITE', genre, search, status, sort] as const,
      queryFn: async (context) => {
        const offset = (context.pageParam as number | null) ?? 0;
        const fullParams = params.set('offset', offset.toString());

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

          return nextOffset;
        }
        return null;
      },
      initialPageParam: 0,
      keepPreviousData: true,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
    };
  });

  public totalBooksCount = computed(() => {
    const data = this.booksInfiniteQuery.data();
    return data && data.pages.length > 0 ? data.pages[0].data.count : 0;
  });

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
