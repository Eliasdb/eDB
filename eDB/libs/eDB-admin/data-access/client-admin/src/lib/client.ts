import { SelectionModel } from '@angular/cdk/collections';
import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import {
  injectMutation,
  injectQuery,
  QueryClient,
} from '@tanstack/angular-query-experimental';
import { firstValueFrom, lastValueFrom, map } from 'rxjs';

import { environment } from '@eDB/shared-env';

import {
  AdminStats,
  Application,
  CreateApplicationDto,
  PaginatedResponse,
  UserProfile,
} from './types/admin.types';
import { Book } from './types/book.types';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  private http = inject(HttpClient);
  private queryClient = inject(QueryClient);

  // USER RELATED
  async queryAllUsers(
    cursor: number | string | null,
    searchParam?: string,
    sortParam?: string,
  ): Promise<PaginatedResponse<UserProfile>> {
    let params = new HttpParams();

    if (cursor !== null && cursor !== undefined) {
      if (typeof cursor === 'string') {
        try {
          const parsedCursor = JSON.parse(cursor);

          if (
            typeof parsedCursor === 'object' &&
            parsedCursor.value !== undefined &&
            parsedCursor.id !== undefined
          ) {
            params = params.set('cursor', JSON.stringify(parsedCursor));
          } else {
            params = params.set('cursor', cursor);
          }
        } catch (error) {
          console.error('Failed to parse cursor:', error);
          params = params.set('cursor', cursor);
        }
      } else {
        params = params.set('cursor', cursor.toString());
      }
    }

    if (searchParam && searchParam.trim() !== '') {
      params = params.set('search', searchParam.trim());
    }

    if (sortParam && sortParam.trim() !== '') {
      const [sortField, sortDirection] = sortParam.split(',');
      const backendSortField = this.mapSortFieldToBackend(sortField);
      const backendSortParam = `${backendSortField},${sortDirection}`;
      params = params.set('sort', backendSortParam);
    }

    return lastValueFrom(
      this.http.get<PaginatedResponse<UserProfile>>(
        `${environment.apiAdminUrl}/users`,
        { params },
      ),
    );
  }

  queryUserById(userId: number) {
    const userSignal = signal<UserProfile | null>(null);
    injectQuery(() => ({
      queryKey: ['user', userId],
      queryFn: async () => {
        const user = await firstValueFrom(
          this.http.get<UserProfile>(
            `${environment.apiAdminUrl}/users/${userId}`,
          ),
        );
        if (!user) {
          throw new Error('User not found');
        }
        userSignal.set(user);
        return user;
      },
    }));
    return userSignal;
  }

  deleteUserMutation() {
    return injectMutation(() => ({
      mutationFn: async (userId: number) => {
        return firstValueFrom(
          this.http.delete<void>(`${environment.apiAdminUrl}/users/${userId}`),
        );
      },
      onSuccess: () => {
        this.queryClient.invalidateQueries({ queryKey: ['users'] });
      },
    }));
  }

  revokeSubscriptionMutation() {
    return injectMutation(() => ({
      mutationFn: async ({
        applicationId,
        userId,
      }: {
        applicationId: number;
        userId: number;
      }) => {
        return firstValueFrom(
          this.http.delete<void>(
            `${environment.apiAdminUrl}/applications/${applicationId}/subscriptions/${userId}`,
          ),
        );
      },
      onSuccess: () => {
        this.queryClient.invalidateQueries({ queryKey: ['applications'] });
      },
    }));
  }

  // APPLICATION RELATED

  queryApplications() {
    return injectQuery(() => ({
      queryKey: ['applications'],
      queryFn: async () => {
        const subscriptions = await firstValueFrom(
          this.http.get<Application[]>(
            `${environment.apiAdminUrl}/applications`,
          ),
        );
        if (!subscriptions) {
          throw new Error('Subscriptions not found');
        }
        return subscriptions;
      },
      refetchOnWindowFocus: false,
      refetchOnMount: false,
    }));
  }

  addApplicationMutation() {
    return injectMutation(() => ({
      mutationFn: async (application: CreateApplicationDto) => {
        return firstValueFrom(
          this.http.post(
            `${environment.apiAdminUrl}/applications/create`,
            application,
          ),
        );
      },
      onSuccess: () => {
        this.queryClient.invalidateQueries({ queryKey: ['applications'] });
      },
    }));
  }

  editApplicationMutation() {
    return injectMutation(() => ({
      mutationFn: async (application: Application) => {
        return firstValueFrom(
          this.http.put(
            `${environment.apiAdminUrl}/applications/${application.applicationId}`,
            application,
          ),
        );
      },
      onSuccess: () => {
        this.queryClient.invalidateQueries({ queryKey: ['applications'] });
      },
    }));
  }

  deleteApplicationMutation() {
    return injectMutation(() => ({
      mutationFn: async (applicationId: number) => {
        return firstValueFrom(
          this.http.delete<void>(
            `${environment.apiAdminUrl}/applications/${applicationId}`,
          ),
        );
      },
      onSuccess: () => {
        this.queryClient.invalidateQueries({ queryKey: ['applications'] });
      },
    }));
  }

  public mapSortFieldToBackend(sortField: string): keyof UserProfile {
    const fieldMapping: { [key: string]: keyof UserProfile } = {
      firstname: 'firstName',
      lastname: 'lastName',
      email: 'email',
      role: 'role',
      state: 'state',
      id: 'id',
    };
    return fieldMapping[sortField.toLowerCase()] || 'id';
  }

  // BOOKS

  public isSheetClosed = signal<boolean>(true);
  public selectedBooks = signal<Book[]>([]);
  public isChecked = signal<boolean>(false);
  public isMainChecked = signal<boolean>(false);
  public selection: SelectionModel<Book> = new SelectionModel<Book>(true, []);

  addBook() {
    return injectMutation(() => ({
      mutationFn: async (book: Book) => {
        return firstValueFrom(
          this.http.post<Book>(`${environment.bookAPIUrl}/books`, book),
        );
      },
      onSuccess: () => {
        this.queryClient.invalidateQueries({
          queryKey: ['ADMIN_BOOKS_INFINITE'],
        });
      },
    }));
  }

  editBook() {
    return injectMutation(() => ({
      mutationFn: async (book: Book) => {
        return firstValueFrom(
          this.http.put(`${environment.bookAPIUrl}/books/${book.id}`, book),
        );
      },
      onSuccess: () => {
        this.queryClient.invalidateQueries({
          queryKey: ['ADMIN_BOOKS_INFINITE'],
        });
      },
    }));
  }

  deleteBook() {
    return injectMutation(() => ({
      mutationFn: async (bookId: number) => {
        return firstValueFrom(
          this.http.delete<Book>(`${environment.bookAPIUrl}/books/${bookId}`),
        );
      },
      onSuccess: () => {
        this.queryClient.invalidateQueries({
          queryKey: ['ADMIN_BOOKS_INFINITE'],
        });
      },
    }));
  }

  queryAdminStats = injectQuery(() => ({
    queryKey: ['ADMIN_STATS'],
    queryFn: async () =>
      await firstValueFrom(
        this.http
          .get<AdminStats>(`${environment.bookAPIUrl}/admin-stats`)
          .pipe(map((response) => response.data)),
      ),
    refetchOnWindowFocus: false,
    refetchOnMount: true,
  }));

  // Instead of using a manually updated mutable signal, we now derive query parameters automatically
  // from the BookParamService signals.
  // private queryParams = computed<Partial<BookQueryParams>>(() => ({
  //   search: this.bookParamService.querySignal(),
  //   genre: this.bookParamService.genreSignal(),
  //   status: this.bookParamService.statusSignal(),
  //   sort: this.bookParamService.sortSignal(),
  // }));

  // // The infinite query for admin books. It automatically re-runs whenever the derived queryParams change.
  // queryAdminBooks = injectInfiniteQuery<RawApiDataBooks, Error>(() => {
  //   const paramsSignal = this.queryParams();
  //   let params = new HttpParams();

  //   if (paramsSignal.genre && paramsSignal.genre !== '') {
  //     params = params.set('genre', paramsSignal.genre as string);
  //   }
  //   if (paramsSignal.search && paramsSignal.search !== '') {
  //     params = params.set('q', paramsSignal.search as string);
  //   }
  //   if (paramsSignal.sort && paramsSignal.sort !== '') {
  //     params = params.set('sort', paramsSignal.sort as string);
  //   }
  //   if (paramsSignal.status && paramsSignal.status !== '') {
  //     params = params.set('status', paramsSignal.status as string);
  //   }
  //   // Set a default limit per page
  //   const limit = 15;
  //   params = params.set('limit', limit.toString());

  //   return {
  //     queryKey: [
  //       'ADMIN_BOOKS_INFINITE',
  //       paramsSignal[GENRE_QUERY_PARAM],
  //       paramsSignal[SEARCH_QUERY_PARAM],
  //       paramsSignal[STATUS_QUERY_PARAM],
  //       paramsSignal[SORT_QUERY_PARAM],
  //     ] as const,
  //     queryFn: async (context) => {
  //       // Calculate offset from the current page parameter (default is 0)
  //       const offset = (context.pageParam as number | null) ?? 0;
  //       const fullParams = params.set('offset', offset.toString());

  //       return await firstValueFrom(
  //         this.http.get<RawApiDataBooks>(`${environment.bookAPIUrl}/books`, {
  //           params: fullParams,
  //         }),
  //       );
  //     },
  //     getNextPageParam: (lastPage: RawApiDataBooks) => {
  //       if (lastPage.data.hasMore) {
  //         const currentOffset = Number(lastPage.data.offset) || 0;
  //         const pageLimit = Number(lastPage.data.limit) || limit;
  //         const nextOffset = currentOffset + pageLimit;
  //         return nextOffset;
  //       }
  //       return null;
  //     },
  //     initialPageParam: 0,
  //     keepPreviousData: true,
  //     refetchOnWindowFocus: false,
  //     refetchOnMount: false,
  //   };
  // });
}
