import { Injectable, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { Genre } from '@eDB-webshop/shared-data';
import {
  debounceTime,
  distinctUntilChanged,
  filter,
  map,
  shareReplay,
  startWith,
} from 'rxjs';
import {
  BookQueryParams,
  GENRE_QUERY_PARAM,
  LIMIT_QUERY_PARAM,
  OFFSET_QUERY_PARAM,
  SEARCH_QUERY_PARAM,
  SORT_QUERY_PARAM,
  STATUS_QUERY_PARAM,
} from './book-param.type';

@Injectable({
  providedIn: 'root',
})
export class BookParamService {
  private activatedRoute = inject(ActivatedRoute);
  private router = inject(Router);
  private queryParams$ = this.activatedRoute.queryParams;

  public querySignal = toSignal(
    this.queryParams$.pipe(
      filter((params) => params[SEARCH_QUERY_PARAM] !== undefined),
      map((params): string => params[SEARCH_QUERY_PARAM]),
      startWith(
        this.activatedRoute.snapshot.queryParams[SEARCH_QUERY_PARAM] ?? '',
      ),
      distinctUntilChanged(),
      shareReplay({ bufferSize: 1, refCount: false }),
    ),
    {
      initialValue:
        this.activatedRoute.snapshot.queryParams[SEARCH_QUERY_PARAM] ?? '',
    },
  );

  public genreSignal = toSignal(
    this.queryParams$.pipe(
      filter((params) => params[GENRE_QUERY_PARAM] !== undefined),
      map((params): Genre => params[GENRE_QUERY_PARAM]),
      debounceTime(200),
      startWith(
        this.activatedRoute.snapshot.queryParams[GENRE_QUERY_PARAM] ?? '',
      ),
      shareReplay({ bufferSize: 1, refCount: false }),
    ),
    {
      initialValue:
        this.activatedRoute.snapshot.queryParams[GENRE_QUERY_PARAM] ?? '',
    },
  );

  public statusSignal = toSignal(
    this.queryParams$.pipe(
      filter((params) => params[STATUS_QUERY_PARAM] !== undefined),
      map((params): string => params[STATUS_QUERY_PARAM]),
      debounceTime(200),
      startWith(
        this.activatedRoute.snapshot.queryParams[STATUS_QUERY_PARAM] ??
          'available',
      ),
      distinctUntilChanged(),
      shareReplay({ bufferSize: 1, refCount: false }),
    ),
    {
      initialValue:
        this.activatedRoute.snapshot.queryParams[STATUS_QUERY_PARAM] ??
        'available',
    },
  );

  public sortSignal = toSignal(
    this.queryParams$.pipe(
      filter((params) => params[SORT_QUERY_PARAM] !== undefined),
      map((params): string => params[SORT_QUERY_PARAM]),
      startWith(
        this.activatedRoute.snapshot.queryParams[SORT_QUERY_PARAM] ?? '',
      ),
      debounceTime(200),
      distinctUntilChanged(),
      shareReplay({ bufferSize: 1, refCount: false }),
    ),
    {
      initialValue:
        this.activatedRoute.snapshot.queryParams[SORT_QUERY_PARAM] ?? '',
    },
  );

  public limitSignal = toSignal(
    this.queryParams$.pipe(
      filter((params) => params[LIMIT_QUERY_PARAM] !== undefined),
      map((params): string => params[LIMIT_QUERY_PARAM]),
      startWith(
        this.activatedRoute.snapshot.queryParams[LIMIT_QUERY_PARAM] ?? '',
      ),
      debounceTime(200),
      distinctUntilChanged(),
      shareReplay({ bufferSize: 1, refCount: false }),
    ),
    {
      initialValue:
        this.activatedRoute.snapshot.queryParams[LIMIT_QUERY_PARAM] ?? '',
    },
  );

  public offsetSignal = toSignal(
    this.queryParams$.pipe(
      filter((params) => params[OFFSET_QUERY_PARAM] !== undefined),
      map((params): string => params[OFFSET_QUERY_PARAM]),
      startWith(
        this.activatedRoute.snapshot.queryParams[OFFSET_QUERY_PARAM] ?? '',
      ),
      debounceTime(200),
      distinctUntilChanged(),
      shareReplay({ bufferSize: 1, refCount: false }),
    ),
    {
      initialValue:
        this.activatedRoute.snapshot.queryParams[OFFSET_QUERY_PARAM] ?? '',
    },
  );

  public navigate(params: BookQueryParams): void {
    this.router.navigate([], {
      queryParams: params,
      queryParamsHandling: 'merge',
    });
  }

  public clearParams(): void {
    this.router.navigate([], {
      queryParams: {
        [SEARCH_QUERY_PARAM]: '',
        [STATUS_QUERY_PARAM]: 'available',
        [SORT_QUERY_PARAM]: '',
        [GENRE_QUERY_PARAM]: '',
        [LIMIT_QUERY_PARAM]: 0,
        [OFFSET_QUERY_PARAM]: 0,
      },
      queryParamsHandling: 'merge',
    });
  }
}
