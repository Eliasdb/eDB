// src/app/services/admin-service/admin.service.ts

import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import {
  BehaviorSubject,
  combineLatest,
  debounceTime,
  Observable,
  switchMap,
  tap,
} from 'rxjs';
import { PagedResult } from '../../models/paged-result.model';
import { SortParams } from '../../models/sort-event.model';
import { UserProfile } from '../../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  private readonly apiUrl = 'http://localhost:9101/api/admin/users'; // Consider using environment variables
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
      debounceTime(50), // Wait for 50ms to batch updates
      tap(() => this.isLoading$.next(true)),
      switchMap(([sortParams, pageParam]) =>
        this.fetchUsersPage(
          sortParams.sortField,
          sortParams.sortDirection,
          pageParam
        ).pipe(
          tap((pagedResult) => {
            this.isLoading$.next(false);
            this.hasMore$.next(pagedResult.hasMore);
          })
        )
      )
    );
  }

  private fetchUsersPage(
    sortField: string = 'id',
    sortDirection: 'asc' | 'desc' = 'asc',
    pageNumber: number = 1
  ): Observable<PagedResult<UserProfile>> {
    const url = `${this.apiUrl}?pageNumber=${pageNumber}&pageSize=15&sortField=${sortField}&sortDirection=${sortDirection}`;
    return this.http.get<PagedResult<UserProfile>>(url);
  }
}
