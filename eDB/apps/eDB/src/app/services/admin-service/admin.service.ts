// src/app/services/admin-service/admin.service.ts

import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import {
  injectMutation,
  injectQuery,
  QueryClient,
} from '@tanstack/angular-query-experimental';
import {
  BehaviorSubject,
  catchError,
  combineLatest,
  debounceTime,
  firstValueFrom,
  Observable,
  shareReplay,
  switchMap,
  tap,
  throwError,
} from 'rxjs';
import {
  ApplicationOverviewDto,
  CreateApplicationDto,
} from '../../models/application-overview.model';
import { PagedResult } from '../../models/paged-result.model';
import { SortParams } from '../../models/sort-event.model';
import { UserProfile } from '../../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  private readonly apiUrl = 'http://localhost:9101/api/admin/users'; // Consider using environment variables
  private readonly applicationsUrl =
    'http://localhost:9101/api/admin/applications-overview';

  private readonly baseUrl = 'http://localhost:9101/api/admin';

  private http = inject(HttpClient);

  private sortParams$ = new BehaviorSubject<SortParams>({
    sortField: 'id',
    sortDirection: 'asc',
  });
  private pageParam$ = new BehaviorSubject<number>(1);
  private searchParam$ = new BehaviorSubject<string>('');

  private isLoading$ = new BehaviorSubject<boolean>(false);
  private hasMore$ = new BehaviorSubject<boolean>(true);

  private queryClient = inject(QueryClient);

  getSearchParam$(): Observable<string> {
    return this.searchParam$.asObservable();
  }

  getSortParams$(): Observable<SortParams> {
    return this.sortParams$.asObservable();
  }

  getPageParam$(): Observable<number> {
    return this.pageParam$.asObservable();
  }

  getIsLoading$(): Observable<boolean> {
    return this.isLoading$.asObservable();
  }

  getHasMore$(): Observable<boolean> {
    return this.hasMore$.asObservable();
  }

  getCurrentPage(): number {
    return this.pageParam$.value;
  }

  updateSortParams(params: SortParams): void {
    this.sortParams$.next(params);
  }

  updatePageParam(page: number): void {
    this.pageParam$.next(page);
  }

  updateSearchParam(search: string): void {
    this.searchParam$.next(search);
  }

  resetSortAndPage(sortParams: SortParams): void {
    this.sortParams$.next(sortParams);
    this.pageParam$.next(1); // Reset to the first page
  }

  fetchPaginatedData$(): Observable<PagedResult<UserProfile>> {
    return combineLatest([
      this.sortParams$,
      this.pageParam$,
      this.searchParam$,
    ]).pipe(
      debounceTime(50), // Adjust debounce time as needed
      tap(([sortParams, pageParam, searchParam]) => {
        console.log(
          `Fetching users with sortField=${sortParams.sortField}, sortDirection=${sortParams.sortDirection}, pageNumber=${pageParam}, search=${searchParam}`
        );
        this.isLoading$.next(true);
      }),
      switchMap(([sortParams, pageParam, searchParam]) =>
        this.fetchUsersPage(
          this.mapSortFieldToBackend(sortParams.sortField),
          sortParams.sortDirection,
          pageParam,
          searchParam
        ).pipe(
          tap((pagedResult) => {
            this.isLoading$.next(false);
            this.hasMore$.next(pagedResult.hasMore);
          }),
          catchError((error) => {
            this.isLoading$.next(false);
            return throwError(() => error);
          })
        )
      ),
      shareReplay(1)
    );
  }

  /**
   * Maps frontend sortField to backend sortField.
   * @param sortField Frontend sort field.
   * @returns Backend sort field.
   */
  private mapSortFieldToBackend(sortField: string): string {
    const fieldMapping: { [key: string]: string } = {
      id: 'id',
      name: 'firstName', // Assuming 'Name' maps to 'FirstName'
      email: 'email',
      role: 'role',
      state: 'state',
    };
    const backendSortField = fieldMapping[sortField];

    return backendSortField || 'id';
  }

  private fetchUsersPage(
    sortField: string = 'id',
    sortDirection: 'asc' | 'desc' = 'asc',
    pageNumber: number = 1,
    search: string = ''
  ): Observable<PagedResult<UserProfile>> {
    const url = `${this.apiUrl}?pageNumber=${pageNumber}&pageSize=15&sortField=${sortField}&sortDirection=${sortDirection}&search=${search}`;
    return this.http.get<PagedResult<UserProfile>>(url);
  }

  // fetchApplicationsOverview$(): Observable<ApplicationOverviewDto[]> {
  //   return this.http.get<ApplicationOverviewDto[]>(this.applicationsUrl);
  // }

  fetchSubscriptions() {
    return injectQuery(() => ({
      queryKey: ['subscriptions'],
      queryFn: async () => {
        const subscriptions = await firstValueFrom(
          this.http.get<ApplicationOverviewDto[]>(
            `${this.baseUrl}/applications-overview`
          )
        );
        if (!subscriptions) {
          throw new Error('Subscriptions not found');
        }
        return subscriptions;
      },
    }));
  }

  // Revoke subscription for a user
  revokeSubscription() {
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
            `${this.baseUrl}/applications/${applicationId}/subscriptions/${userId}`
          )
        );
      },
      onSuccess: () => {
        this.queryClient.invalidateQueries({ queryKey: ['subscriptions'] });
      },
    }));
  }

  addApplicationMutation() {
    return injectMutation(() => ({
      mutationFn: async (application: CreateApplicationDto) => {
        return firstValueFrom(
          this.http.post(`${this.baseUrl}/applications/create`, application)
        );
      },
      onSuccess: () => {
        // Invalidate the subscriptions query to refresh data
        this.queryClient.invalidateQueries({ queryKey: ['subscriptions'] });
      },
    }));
  }
}
