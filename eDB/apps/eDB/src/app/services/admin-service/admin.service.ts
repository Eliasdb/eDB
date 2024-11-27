// src/app/services/admin-service/admin.service.ts

import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import {
  BehaviorSubject,
  catchError,
  combineLatest,
  debounceTime,
  Observable,
  shareReplay,
  switchMap,
  tap,
  throwError,
} from 'rxjs';
import { ApplicationOverviewDto } from '../../models/application-overview.model';
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

  private http = inject(HttpClient);

  private sortParams$ = new BehaviorSubject<SortParams>({
    sortField: 'id',
    sortDirection: 'asc',
  });
  private pageParam$ = new BehaviorSubject<number>(1);
  private isLoading$ = new BehaviorSubject<boolean>(false);
  private hasMore$ = new BehaviorSubject<boolean>(true);

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

  resetSortAndPage(sortParams: SortParams): void {
    this.sortParams$.next(sortParams);
    this.pageParam$.next(1); // Reset to the first page
  }

  fetchPaginatedData$(): Observable<PagedResult<UserProfile>> {
    return combineLatest([this.sortParams$, this.pageParam$]).pipe(
      debounceTime(50), // Adjust debounce time as needed
      tap(([sortParams, pageParam]) => {
        console.log(
          `Fetching users with sortField=${sortParams.sortField}, sortDirection=${sortParams.sortDirection}, pageNumber=${pageParam}`
        );
        this.isLoading$.next(true);
      }),
      switchMap(([sortParams, pageParam]) =>
        this.fetchUsersPage(
          this.mapSortFieldToBackend(sortParams.sortField),
          sortParams.sortDirection,
          pageParam
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
      shareReplay(1) // Share the latest emitted value with new subscribers
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
    pageNumber: number = 1
  ): Observable<PagedResult<UserProfile>> {
    const url = `${this.apiUrl}?pageNumber=${pageNumber}&pageSize=15&sortField=${sortField}&sortDirection=${sortDirection}`;
    return this.http.get<PagedResult<UserProfile>>(url);
  }

  fetchApplicationsOverview$(): Observable<ApplicationOverviewDto[]> {
    return this.http.get<ApplicationOverviewDto[]>(this.applicationsUrl);
  }
}
