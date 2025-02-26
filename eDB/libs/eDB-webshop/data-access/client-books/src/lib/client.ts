import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { RawApiDataBooks } from '@eDB-webshop/shared-types';
import { environment } from '@eDB/shared-env';

import { injectQuery } from '@tanstack/angular-query-experimental';
import { firstValueFrom } from 'rxjs';
import {
  AUTHORS_QUERY_PARAM,
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

  /**
   * The signal-based query for books.
   * When any value in queryParams changes, the queryKey will update and the queryFn will run.
   */
  queryBooks = injectQuery<RawApiDataBooks, Error>(() => {
    const paramsSignal = this.queryParams();
    // Use default status 'available' if not provided.
    const status =
      paramsSignal.status && paramsSignal.status !== ''
        ? paramsSignal.status
        : 'available';

    let params = new HttpParams().set('status', status);
    if (paramsSignal.genre && paramsSignal.genre !== '') {
      params = params.set('genre', paramsSignal.genre as string);
    }
    if (paramsSignal.search && paramsSignal.search !== '') {
      params = params.set('q', paramsSignal.search as string);
    }
    if (paramsSignal.author && paramsSignal.author !== '') {
      params = params.set('author', paramsSignal.author as string);
    }
    if (paramsSignal.sort && paramsSignal.sort !== '') {
      params = params.set('sort', paramsSignal.sort as string);
    }
    if (paramsSignal.genre && paramsSignal.genre === 'all') {
      params = params.set('genre', '');
    }

    return {
      queryKey: [
        'BOOKS',
        paramsSignal[AUTHORS_QUERY_PARAM],
        paramsSignal[GENRE_QUERY_PARAM],
        paramsSignal[SEARCH_QUERY_PARAM],
        paramsSignal[STATUS_QUERY_PARAM],
        paramsSignal[SORT_QUERY_PARAM],
      ] as const,
      queryFn: async () => {
        return await firstValueFrom(
          this.http.get<RawApiDataBooks>(`${environment.bookAPIUrl}/books`, {
            params,
          }),
        );
      },
      refetchOnWindowFocus: false,
      refetchOnMount: true,
    };
  });

  /**
   * Updates the internal query parameters signal.
   * When these parameters are updated, the queryBooks computed query will automatically refetch.
   */
  updateQueryBooks(newParams: Partial<BookQueryParams>) {
    this.queryParams.set(newParams);
    // Optionally, you can return queryBooks if you need to chain further actions.
    return this.queryBooks;
  }

  // --- Query Books By Id ---
  // Create a signal to hold the currently selected book id.
  // public selectedBookId = signal<number | null>(null);

  // // Create a query that depends on the selectedBookId.
  // // If selectedBookId() is null, the queryFn will throw an error.
  // public queryBookById = injectQuery<RawApiDataBook, Error>(() => {
  //   const id = this.selectedBookId();
  //   if (id === null) {
  //     throw new Error('No book id set');
  //   }
  //   return {
  //     queryKey: ['BOOKS', id] as const,
  //     queryFn: async () => {
  //       return await firstValueFrom(
  //         this.http.get<RawApiDataBook>(
  //           `${environment.bookAPIUrl}/books/${id}`,
  //         ),
  //       );
  //     },
  //     refetchOnMount: true,
  //   };
  // });

  // // Update method to set the id signal.
  // public updateSelectedBookId(id: number) {
  //   this.selectedBookId.set(id);
  //   return this.queryBookById;
  // }

  // --- Query Books By Genre ---
  // Create a signal for the currently selected genre.
  public selectedGenre = signal<string | undefined>(undefined);

  // Create a query that depends on the selected genre.
  public queryBooksByGenre = injectQuery<RawApiDataBooks, Error>(() => {
    const genre = this.selectedGenre();
    // Build HTTP parameters using the genre (if provided).
    const params = new HttpParams().set('genre', genre || '');
    return {
      queryKey: ['RELATED_BOOKS', genre] as const,
      queryFn: async () => {
        return await firstValueFrom(
          this.http.get<RawApiDataBooks>(`${environment.bookAPIUrl}/books`, {
            params,
          }),
        );
      },
      refetchOnMount: true,
    };
  });

  // Update method to set the genre signal.
  public updateSelectedGenre(genre?: string) {
    this.selectedGenre.set(genre);
    return this.queryBooksByGenre;
  }
}
