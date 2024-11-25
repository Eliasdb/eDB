import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import {
  InfiniteData,
  injectInfiniteQuery,
  QueryFunctionContext,
} from '@tanstack/angular-query-experimental';
import { firstValueFrom } from 'rxjs';
import { PagedResult } from '../../models/paged-result.model';
import { UserProfile } from '../../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  private readonly apiUrl = 'http://localhost:9101/api/admin/users';
  private http = inject(HttpClient);

  fetchUsers() {
    const queryKey = ['adminUsers'] as const;

    return injectInfiniteQuery<
      PagedResult<UserProfile>, // TQueryFnData
      Error, // TError
      InfiniteData<PagedResult<UserProfile>, number>, // TData
      typeof queryKey, // TQueryKey
      number // TPageParam
    >(() => ({
      queryKey,
      queryFn: ({
        pageParam = 1,
      }: QueryFunctionContext<typeof queryKey, number>) => {
        const url = `${this.apiUrl}?pageNumber=${pageParam}&pageSize=15`;
        return firstValueFrom(this.http.get<PagedResult<UserProfile>>(url));
      },
      getNextPageParam: (lastPage, pages) => {
        return lastPage.hasMore ? pages.length + 1 : undefined;
      },
      initialPageParam: 1, // Specifies the initial page parameter
    }));
  }
}
