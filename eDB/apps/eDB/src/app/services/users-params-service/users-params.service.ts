import { Injectable, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { distinctUntilChanged, map, shareReplay } from 'rxjs';
import {
  CURSOR_QUERY_PARAM,
  SEARCH_QUERY_PARAM,
  SORT_QUERY_PARAM,
  UserQueryParams,
} from './users-params.service.type';

@Injectable({
  providedIn: 'root',
})
export class UserParamService {
  private activatedRoute = inject(ActivatedRoute);
  private router = inject(Router);
  private queryParams$ = this.activatedRoute.queryParams;

  public query$ = this.queryParams$.pipe(
    map((params): string => params[SEARCH_QUERY_PARAM] || ''),
    distinctUntilChanged(),
    shareReplay({ bufferSize: 1, refCount: false })
  );

  public sort$ = this.queryParams$.pipe(
    map((params): string => params[SORT_QUERY_PARAM] || 'id,asc'),
    distinctUntilChanged(),
    shareReplay({ bufferSize: 1, refCount: false })
  );

  public cursor$ = this.queryParams$.pipe(
    map((params) => {
      const cursor = params[CURSOR_QUERY_PARAM];
      return cursor ? Number(cursor) : null;
    }),
    distinctUntilChanged(),
    shareReplay({ bufferSize: 1, refCount: false })
  );

  public navigate(params: UserQueryParams): void {
    this.router.navigate([], {
      queryParams: params,
      queryParamsHandling: 'merge',
    });
  }

  public clearParams() {
    this.router.navigate([], {
      queryParams: {
        [SEARCH_QUERY_PARAM]: '',
        [SORT_QUERY_PARAM]: '',
      },
      queryParamsHandling: 'merge',
    });
  }
}
