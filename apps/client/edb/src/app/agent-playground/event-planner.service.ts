import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, firstValueFrom, map } from 'rxjs';

export type Venue = {
  id: string;
  name: string;
  city: string;
  capacity?: number | null;
  createdAt?: string;
  updatedAt?: string;
};

export type EventStatus = 'planned' | 'scheduled' | 'completed';

export type EventRecord = {
  id: string;
  title: string;
  startDate: string;
  endDate?: string | null;
  status: EventStatus;
  venueId: string;
  createdAt?: string;
  updatedAt?: string;
  venue?: Pick<Venue, 'id' | 'name' | 'city'>;
};

export type PaginatedResponse<T> = {
  items: T[];
  page: number;
  pageSize: number;
  total: number;
  hasMore: boolean;
  nextPage: number | null;
};

export type GetEventsOptions = {
  page?: number;
  pageSize?: number;
  includeVenue?: boolean;
  search?: string;
  filter?: Record<string, string | undefined | null>;
};

export type CreateVenuePayload = {
  name: string;
  city: string;
  capacity?: number;
};

export type UpdateVenuePayload = Partial<CreateVenuePayload>;

export type CreateEventPayload = {
  title: string;
  startDate: string;
  endDate?: string;
  status: EventStatus;
  venueId: string;
};

export type UpdateEventPayload = Partial<CreateEventPayload>;

@Injectable({ providedIn: 'root' })
export class EventPlannerService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = 'http://localhost:9102';

  getVenues(params: { page?: number; pageSize?: number; search?: string } = {}): Observable<Venue[]> {
    let httpParams = new HttpParams()
      .set('page', String(params.page ?? 1))
      .set('pageSize', String(params.pageSize ?? 50))
      .set('sort', 'name:asc');

    if (params.search) {
      httpParams = httpParams.set('search', params.search);
    }

    return this.http
      .get<PaginatedResponse<Venue>>(`${this.baseUrl}/venues`, { params: httpParams })
      .pipe(map((res) => res.items ?? []));
  }

  async fetchVenuesPage(options: {
    page?: number;
    pageSize?: number;
    search?: string;
    sort?: string;
    filter?: Record<string, string | undefined>;
  } = {}): Promise<PaginatedResponse<Venue>> {
    let params = new HttpParams()
      .set('page', String(options.page ?? 1))
      .set('pageSize', String(options.pageSize ?? 10));

    if (options.sort) {
      params = params.set('sort', options.sort);
    }

    if (options.search) {
      params = params.set('search', options.search);
    }

    const filterValue = this.buildFilterParam(options.filter);
    if (filterValue) {
      params = params.set('filter', filterValue);
    }

    const response$ = this.http.get<PaginatedResponse<Venue>>(
      `${this.baseUrl}/venues`,
      { params },
    );

    return firstValueFrom(response$);
  }

  createVenue(payload: CreateVenuePayload): Observable<Venue> {
    return this.http
      .post<{ venue: Venue }>(`${this.baseUrl}/venues`, payload)
      .pipe(map((res) => res.venue));
  }

  updateVenue(id: string, payload: UpdateVenuePayload): Observable<Venue> {
    return this.http
      .patch<{ venue: Venue }>(`${this.baseUrl}/venues/${id}`, payload)
      .pipe(map((res) => res.venue));
  }

  deleteVenue(id: string): Observable<void> {
    return this.http
      .delete<{ success: boolean }>(`${this.baseUrl}/venues/${id}`)
      .pipe(map(() => void 0));
  }

  getEvents(options: GetEventsOptions = {}): Observable<PaginatedResponse<EventRecord>> {
    const page = options.page ?? 1;
    const pageSize = options.pageSize ?? 10;

    let params = new HttpParams()
      .set('page', String(page))
      .set('pageSize', String(pageSize))
      .set('sort', 'startDate:asc');

    if (options.includeVenue) {
      params = params.set('include', 'venue');
    }

    if (options.search) {
      params = params.set('search', options.search);
    }

    const filterValue = this.buildFilterParam(options.filter);
    if (filterValue) {
      params = params.set('filter', filterValue);
    }

    return this.http.get<PaginatedResponse<EventRecord>>(`${this.baseUrl}/events`, {
      params,
    });
  }

  createEvent(payload: CreateEventPayload): Observable<EventRecord> {
    return this.http
      .post<{ event: EventRecord }>(`${this.baseUrl}/events`, payload)
      .pipe(map((res) => res.event));
  }

  updateEvent(id: string, payload: UpdateEventPayload): Observable<EventRecord> {
    return this.http
      .patch<{ event: EventRecord }>(`${this.baseUrl}/events/${id}`, payload)
      .pipe(map((res) => res.event));
  }

  deleteEvent(id: string): Observable<void> {
    return this.http
      .delete<{ success: boolean }>(`${this.baseUrl}/events/${id}`)
      .pipe(map(() => void 0));
  }

  formatError(error: unknown): string {
    if (!error) return 'Unexpected error';
    if (typeof error === 'string') return error;
    if (error instanceof Error) return error.message || 'Unexpected error';

    const maybeHttpError = error as {
      status?: number;
      statusText?: string;
      error?: { message?: string; error?: string } | string;
      message?: string;
    };

    if (typeof maybeHttpError.error === 'string') {
      return maybeHttpError.error;
    }

    const nestedMessage =
      maybeHttpError.error?.message ??
      maybeHttpError.error?.error ??
      maybeHttpError.message ??
      maybeHttpError.statusText;

    if (nestedMessage) return nestedMessage;

    if (maybeHttpError.status) {
      return `Request failed with status ${maybeHttpError.status}`;
    }

    return 'Unexpected error';
  }

  private buildFilterParam(
    filter: Record<string, string | undefined | null> = {},
  ): string | undefined {
    const entries = Object.entries(filter)
      .filter(([, value]) => value !== undefined && value !== null && value !== '')
      .map(([key, value]) => `${key}=${value}`);
    return entries.length ? entries.join(',') : undefined;
  }
}
