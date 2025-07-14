import { SelectionModel } from '@angular/cdk/collections';
import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import {
  injectInfiniteQuery,
  injectMutation,
  injectQuery,
  QueryClient,
} from '@tanstack/angular-query-experimental';
import { firstValueFrom, lastValueFrom } from 'rxjs';

import { environment } from '@eDB/shared-env';
import { mapOrderDtoToOrder } from './utils/order.mapper';

import {
  Book,
  OrdersApiResponse,
  RawApiDataBooks,
} from '@eDB-webshop/shared-types';
import {
  Application,
  CreateApplicationDto,
  PaginatedResponse,
  UserProfile,
} from './types/admin.types';

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
            `${environment.apiAdminUrl}/applications/${application.id}`,
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

  /**
   * Expected API shape:
   * {
   *   items: Book[];
   *   count: number;
   *   hasMore: boolean;
   *   offset: number;
   *   limit: number;
   * }
   */
  queryBooks() {
    return injectQuery(() => ({
      queryKey: ['books'],
      queryFn: async () => {
        const res = await firstValueFrom(
          this.http.get<RawApiDataBooks>(`${environment.bookAPIUrl}/books`),
        );

        // Pull out the array while still fetching the whole object
        const books = res?.data.items ?? [];

        if (!books.length) {
          throw new Error('Books not found');
        }
        return books; // <— always Book[]
      },
      refetchOnWindowFocus: false,
      refetchOnMount: false,
    }));
  }

  queryBooksInfinite(pageSize = 15) {
    type Page = { items: Book[]; hasMore: boolean; nextOffset: number };

    return injectInfiniteQuery<Page>(() => ({
      initialPageParam: 0,
      queryKey: ['books', pageSize],
      queryFn: async ({ pageParam = 0 }) => {
        const params = new HttpParams()
          .set('offset', String(pageParam))
          .set('limit', pageSize);

        const res = await firstValueFrom(
          this.http.get<RawApiDataBooks>(`${environment.bookAPIUrl}/books`, {
            params,
          }),
        );

        const {
          items = [],
          hasMore = false,
          offset = 0,
        } = res.data as {
          items: Book[];
          hasMore: boolean;
          offset: number | string;
        };

        return {
          items,
          hasMore,
          nextOffset: Number(offset) + items.length,
        };
      },
      getNextPageParam: (lastPage) =>
        lastPage.hasMore ? lastPage.nextOffset : undefined,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
    }));
  }

  queryAllOrders() {
    return injectQuery(() => ({
      queryKey: ['admin-orders'],
      queryFn: async () => {
        const res = await firstValueFrom(
          this.http.get<OrdersApiResponse>(
            `${environment.bookAPIUrl}/admin/orders`,
          ),
        );
        return res.data.map(mapOrderDtoToOrder);
      },
      refetchOnMount: false,
      refetchOnWindowFocus: false,
    }));
  }
}
