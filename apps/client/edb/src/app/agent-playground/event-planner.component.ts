import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  ViewChild,
  AfterViewInit,
  OnDestroy,
  computed,
  effect,
  inject,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormControl,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { injectInfiniteQuery } from '@tanstack/angular-query-experimental';
import { Subject, debounceTime, distinctUntilChanged, finalize } from 'rxjs';

import {
  CreateEventPayload,
  CreateVenuePayload,
  EventPlannerService,
  EventRecord,
  EventStatus,
  UpdateEventPayload,
  UpdateVenuePayload,
  Venue,
} from './event-planner.service';

@Component({
  selector: 'app-event-planner',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'block w-full',
  },
  template: `
    <section class="space-y-6">
      <header class="space-y-1">
        <h2 class="text-xl font-semibold text-[color:var(--foreground,#111827)]">
          Event Planner
        </h2>
        <p class="text-sm text-[color:var(--muted-foreground,#6b7280)]">
          Manage venues and schedule events in a single workspace. Create venues
          first, then plan events tied to a location.
        </p>
      </header>

      <div class="grid gap-6 lg:grid-cols-[repeat(auto-fit,minmax(280px,1fr))]">
        <form
          class="rounded-2xl border border-[color:var(--border,#e5e7eb)] bg-[color:var(--card,#fff)] p-4 shadow-sm space-y-4"
          [formGroup]="venueForm"
          (ngSubmit)="handleCreateVenue()"
          novalidate
        >
          <div class="space-y-1">
            <h3 class="text-base font-semibold">
              @if (editingVenueId()) {
                Edit venue
              } @else {
                Create venue
              }
            </h3>
            <p class="text-sm text-[color:var(--muted-foreground,#6b7280)]">
              @if (editingVenueId()) {
                Update the selected venue or cancel to switch back to creating new entries.
              } @else {
                Capture venue details that events can reference later.
              }
            </p>
          </div>

          <div class="space-y-3">
            <label class="block text-sm font-medium text-[color:var(--foreground,#111827)]">
              Name
              <input
                type="text"
                formControlName="name"
                class="mt-1 block w-full rounded-lg border border-[color:var(--border,#d1d5db)] bg-[color:var(--background,#fff)] px-3 py-2 text-sm focus:border-[color:var(--primary,#4f46e5)] focus:outline-none focus:ring"
                placeholder="E.g. Grand Hall"
              />
            </label>
            @if (venueForm.controls.name.invalid && venueForm.controls.name.touched) {
              <p class="text-xs text-red-600">Venue name is required.</p>
            }

            <label class="block text-sm font-medium text-[color:var(--foreground,#111827)]">
              City
              <input
                type="text"
                formControlName="city"
                class="mt-1 block w-full rounded-lg border border-[color:var(--border,#d1d5db)] bg-[color:var(--background,#fff)] px-3 py-2 text-sm focus:border-[color:var(--primary,#4f46e5)] focus:outline-none focus:ring"
                placeholder="E.g. Seattle"
              />
            </label>
            @if (venueForm.controls.city.invalid && venueForm.controls.city.touched) {
              <p class="text-xs text-red-600">City is required.</p>
            }

            <label class="block text-sm font-medium text-[color:var(--foreground,#111827)]">
              Capacity
              <input
                type="number"
                formControlName="capacity"
                min="0"
                class="mt-1 block w-full rounded-lg border border-[color:var(--border,#d1d5db)] bg-[color:var(--background,#fff)] px-3 py-2 text-sm focus:border-[color:var(--primary,#4f46e5)] focus:outline-none focus:ring"
                placeholder="Optional"
              />
            </label>
          </div>

          <div class="flex flex-wrap items-center gap-3">
            <button
              type="submit"
              class="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
              [disabled]="venueForm.invalid || venueSubmitting()"
            >
              @if (venueSubmitting()) {
                {{ editingVenueId() ? 'Updating…' : 'Saving…' }}
              } @else {
                {{ submitVenueLabel() }}
              }
            </button>

            @if (editingVenueId()) {
              <button
                type="button"
                class="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-100"
                (click)="handleCancelVenueEdit()"
              >
                Cancel edit
              </button>
            }

            @if (venueError()) {
              <span class="text-xs text-red-600">{{ venueError() }}</span>
            }
          </div>
        </form>

        <form
          class="rounded-2xl border border-[color:var(--border,#e5e7eb)] bg-[color:var(--card,#fff)] p-4 shadow-sm space-y-4"
          [formGroup]="eventForm"
          (ngSubmit)="handleCreateEvent()"
          novalidate
        >
          <div class="space-y-1">
            <h3 class="text-base font-semibold">
              @if (editingEventId()) {
                Edit event
              } @else {
                Schedule event
              }
            </h3>
            <p class="text-sm text-[color:var(--muted-foreground,#6b7280)]">
              @if (editingEventId()) {
                Modify event timing or venue, or cancel to plan something new.
              } @else {
                Associate the event with a venue and timeline.
              }
            </p>
          </div>

          <div class="space-y-3">
            <label class="block text-sm font-medium text-[color:var(--foreground,#111827)]">
              Title
              <input
                type="text"
                formControlName="title"
                class="mt-1 block w-full rounded-lg border border-[color:var(--border,#d1d5db)] bg-[color:var(--background,#fff)] px-3 py-2 text-sm focus:border-[color:var(--primary,#4f46e5)] focus:outline-none focus:ring"
                placeholder="E.g. Product Launch"
              />
            </label>
            @if (eventForm.controls.title.invalid && eventForm.controls.title.touched) {
              <p class="text-xs text-red-600">Event title is required.</p>
            }

            <div class="grid gap-3 sm:grid-cols-2">
              <label class="block text-sm font-medium text-[color:var(--foreground,#111827)]">
                Starts
                <input
                  type="datetime-local"
                  formControlName="startDate"
                  class="mt-1 block w-full rounded-lg border border-[color:var(--border,#d1d5db)] bg-[color:var(--background,#fff)] px-3 py-2 text-sm focus:border-[color:var(--primary,#4f46e5)] focus:outline-none focus:ring"
                />
              </label>
              <label class="block text-sm font-medium text-[color:var(--foreground,#111827)]">
                Ends
                <input
                  type="datetime-local"
                  formControlName="endDate"
                  class="mt-1 block w-full rounded-lg border border-[color:var(--border,#d1d5db)] bg-[color:var(--background,#fff)] px-3 py-2 text-sm focus:border-[color:var(--primary,#4f46e5)] focus:outline-none focus:ring"
                />
              </label>
            </div>
            @if (eventForm.controls.startDate.invalid && eventForm.controls.startDate.touched) {
              <p class="text-xs text-red-600">Start date is required.</p>
            }

            <label class="block text-sm font-medium text-[color:var(--foreground,#111827)]">
              Venue
              <select
                formControlName="venueId"
                class="mt-1 block w-full rounded-lg border border-[color:var(--border,#d1d5db)] bg-[color:var(--background,#fff)] px-3 py-2 text-sm focus:border-[color:var(--primary,#4f46e5)] focus:outline-none focus:ring disabled:cursor-not-allowed"
                [disabled]="venues().length === 0"
              >
                <option value="" disabled>Choose venue…</option>
                @for (venue of venues(); track trackVenue($index, venue)) {
                  <option [value]="venue.id">
                    {{ venue.name }} · {{ venue.city }}
                  </option>
                }
              </select>
            </label>

            <label class="block text-sm font-medium text-[color:var(--foreground,#111827)]">
              Status
              <select
                formControlName="status"
                class="mt-1 block w-full rounded-lg border border-[color:var(--border,#d1d5db)] bg-[color:var(--background,#fff)] px-3 py-2 text-sm focus:border-[color:var(--primary,#4f46e5)] focus:outline-none focus:ring"
              >
                @for (status of statuses; track status) {
                  <option [value]="status">
                    {{ status | titlecase }}
                  </option>
                }
              </select>
            </label>
          </div>

          <div class="flex flex-wrap items-center gap-3">
            <button
              type="submit"
              class="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
              [disabled]="eventForm.invalid || eventSubmitting() || venues().length === 0"
            >
              @if (eventSubmitting()) {
                {{ editingEventId() ? 'Updating…' : 'Scheduling…' }}
              } @else {
                {{ submitEventLabel() }}
              }
            </button>

            @if (editingEventId()) {
              <button
                type="button"
                class="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-100"
                (click)="handleCancelEventEdit()"
              >
                Cancel edit
              </button>
            }

            @if (eventError()) {
              <span class="text-xs text-red-600">{{ eventError() }}</span>
            }
          </div>
        </form>
      </div>

      <section class="rounded-2xl border border-[color:var(--border,#e5e7eb)] bg-[color:var(--card,#fff)] p-4 shadow-sm space-y-4">
        <div class="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h3 class="text-base font-semibold">Scheduled events</h3>
            <p class="text-sm text-[color:var(--muted-foreground,#6b7280)]">
              Showing {{ events().length }} of {{ eventTotal() }} records.
            </p>
          </div>
          <div class="flex items-center gap-3">
            <label
              class="text-sm font-medium text-[color:var(--foreground,#111827)]"
              for="venue-filter"
            >
              Venue filter
            </label>
            <select
              id="venue-filter"
              class="rounded-lg border border-[color:var(--border,#d1d5db)] bg-[color:var(--background,#fff)] px-3 py-2 text-sm focus:border-[color:var(--primary,#4f46e5)] focus:outline-none focus:ring"
              [value]="selectedVenue()"
              (change)="handleVenueFilter($any($event.target).value)"
            >
              <option value="all">All venues</option>
              @for (venue of venues(); track trackVenue($index, venue)) {
                <option [value]="venue.id">{{ venue.name }} · {{ venue.city }}</option>
              }
            </select>
          </div>
        </div>

        @if (eventLoading()) {
          <div class="rounded-lg border border-dashed border-[color:var(--border,#d1d5db)] p-4 text-sm text-[color:var(--muted-foreground,#6b7280)]">
            Loading events…
          </div>
        }

        @if (!eventLoading() && eventError()) {
          <div class="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {{ eventError() }}
          </div>
        }

        @if (!eventLoading() && !eventError() && events().length === 0) {
          <div class="rounded-lg border border-dashed border-[color:var(--border,#d1d5db)] p-6 text-center text-sm text-[color:var(--muted-foreground,#6b7280)]">
            No events yet. Add a venue and schedule your first event.
          </div>
        }

        @if (!eventLoading() && !eventError() && events().length > 0) {
          <ul class="space-y-3">
            @for (event of events(); track trackEvent($index, event)) {
              <li class="rounded-xl border border-[color:var(--border,#e5e7eb)] bg-[color:var(--background,#fafafa)] p-4">
                <div class="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div class="space-y-1">
                    <div class="flex items-center gap-2">
                      <h4 class="text-base font-semibold text-[color:var(--foreground,#111827)]">
                        {{ event.title }}
                      </h4>
                      <span
                        class="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium text-white"
                        [ngClass]="statusBadgeClass(event.status)"
                      >
                        {{ event.status | titlecase }}
                      </span>
                    </div>
                    <p class="text-sm text-[color:var(--muted-foreground,#6b7280)]">
                      {{ formatDate(event.startDate) }}
                      @if (event.endDate) {
                        – {{ formatDate(event.endDate) }}
                      }
                    </p>
                    <p class="text-sm text-[color:var(--muted-foreground,#6b7280)]">
                      Venue:
                      @if (event.venue) {
                        {{ event.venue.name }} · {{ event.venue.city }}
                      } @else {
                        {{ fallbackVenueName(event.venueId) }}
                      }
                    </p>
                  </div>
                  <div class="flex flex-col items-start gap-2 text-[color:var(--muted-foreground,#6b7280)] sm:items-end">
                    <span class="text-xs">
                      Created {{ formatDate(event.createdAt) }}
                    </span>
                    <div class="flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        class="inline-flex items-center justify-center rounded-md border border-indigo-200 bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-700 transition-colors hover:bg-indigo-100"
                        [disabled]="deletingEventId() === event.id"
                        (click)="handleEditEvent(event)"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        class="inline-flex items-center justify-center rounded-md border border-rose-200 bg-rose-50 px-2.5 py-1 text-xs font-semibold text-rose-700 transition-colors hover:bg-rose-100"
                        [disabled]="deletingEventId() === event.id"
                        (click)="handleDeleteEvent(event)"
                      >
                        @if (deletingEventId() === event.id) {
                          Deleting…
                        } @else {
                          Delete
                        }
                      </button>
                    </div>
                  </div>
                </div>
              </li>
            }
          </ul>
        }
      </section>

      <section class="rounded-2xl border border-[color:var(--border,#e5e7eb)] bg-[color:var(--card,#fff)] p-4 shadow-sm space-y-4">
        <div class="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <h3 class="text-base font-semibold">Venues directory</h3>
            <p class="text-sm text-[color:var(--muted-foreground,#6b7280)]">
              Browse venues with API-powered filtering, sorting, and infinite scrolling.
            </p>
          </div>
          <div class="text-xs text-[color:var(--muted-foreground,#6b7280)]">
            Showing {{ venuesInfiniteItems().length }} of {{ venuesExplorerTotal() }} venues
          </div>
        </div>

        <div class="grid gap-3 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(160px,1fr)]">
          <label class="flex flex-col gap-1 text-sm font-medium text-[color:var(--foreground,#111827)]">
            Search
            <input
              type="search"
              class="rounded-lg border border-[color:var(--border,#d1d5db)] bg-[color:var(--background,#fff)] px-3 py-2 text-sm focus:border-[color:var(--primary,#4f46e5)] focus:outline-none focus:ring"
              placeholder="Find by name or city"
              [value]="venueSearchTerm()"
              (input)="onVenueSearchChanged($any($event.target).value)"
            />
          </label>

          <label class="flex flex-col gap-1 text-sm font-medium text-[color:var(--foreground,#111827)]">
            City filter
            <input
              type="text"
              class="rounded-lg border border-[color:var(--border,#d1d5db)] bg-[color:var(--background,#fff)] px-3 py-2 text-sm focus:border-[color:var(--primary,#4f46e5)] focus:outline-none focus:ring"
              placeholder="e.g. Seattle"
              [value]="venueCityFilter()"
              (input)="onVenueCityChanged($any($event.target).value)"
            />
          </label>

          <label class="flex flex-col gap-1 text-sm font-medium text-[color:var(--foreground,#111827)]">
            Sort by
            <select
              class="rounded-lg border border-[color:var(--border,#d1d5db)] bg-[color:var(--background,#fff)] px-3 py-2 text-sm focus:border-[color:var(--primary,#4f46e5)] focus:outline-none focus:ring"
              [value]="venueSortOrder()"
              (change)="onVenueSortChanged($any($event.target).value)"
            >
              @for (option of venueSortOptions; track option.value) {
                <option [value]="option.value">
                  {{ option.label }}
                </option>
              }
            </select>
          </label>
        </div>

        @if (venuesInitialLoading()) {
          <div class="rounded-lg border border-dashed border-[color:var(--border,#d1d5db)] p-4 text-sm text-[color:var(--muted-foreground,#6b7280)]">
            Loading venues…
          </div>
        }

        @if (!venuesInitialLoading() && venuesErrorMessage()) {
          <div class="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {{ venuesErrorMessage() }}
          </div>
        }

        @if (!venuesInitialLoading() && !venuesErrorMessage() && venuesInfiniteItems().length === 0) {
          <div class="rounded-lg border border-dashed border-[color:var(--border,#d1d5db)] p-6 text-center text-sm text-[color:var(--muted-foreground,#6b7280)]">
            No venues match the current filters.
          </div>
        }

        @if (venuesInfiniteItems().length > 0) {
          <ul class="space-y-3">
            @for (venue of venuesInfiniteItems(); track trackVenue($index, venue)) {
              <li class="rounded-xl border border-[color:var(--border,#e5e7eb)] bg-[color:var(--background,#fafafa)] p-4">
                <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p class="text-sm font-semibold text-[color:var(--foreground,#111827)]">
                      {{ venue.name }}
                    </p>
                    <p class="text-sm text-[color:var(--muted-foreground,#6b7280)]">
                      {{ venue.city }}
                    </p>
                  </div>
                  <div class="flex flex-col items-start gap-2 text-[color:var(--muted-foreground,#6b7280)] sm:items-end">
                    <span class="text-xs">
                      Capacity:
                      <span class="font-medium">
                        {{ venue.capacity ?? 'Not set' }}
                      </span>
                    </span>
                    <div class="flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        class="inline-flex items-center justify-center rounded-md border border-indigo-200 bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-700 transition-colors hover:bg-indigo-100"
                        [disabled]="deletingVenueId() === venue.id"
                        (click)="handleEditVenue(venue)"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        class="inline-flex items-center justify-center rounded-md border border-rose-200 bg-rose-50 px-2.5 py-1 text-xs font-semibold text-rose-700 transition-colors hover:bg-rose-100"
                        [disabled]="deletingVenueId() === venue.id"
                        (click)="handleDeleteVenue(venue)"
                      >
                        @if (deletingVenueId() === venue.id) {
                          Deleting…
                        } @else {
                          Delete
                        }
                      </button>
                    </div>
                  </div>
                </div>
              </li>
            }
          </ul>
        }

        <div #venuesLoader class="h-2 w-full" aria-hidden="true"></div>

        @if (venuesFetchingNext()) {
          <div class="text-sm text-[color:var(--muted-foreground,#6b7280)]">
            Loading more venues…
          </div>
        }

        @if (!venuesFetchingNext() && !venuesHasMore() && venuesInfiniteItems().length > 0) {
          <div class="text-sm text-[color:var(--muted-foreground,#6b7280)]">
            End of venue results.
          </div>
        }

        @if (venuesHasMore()) {
          <button
            type="button"
            class="w-full rounded-lg border border-[color:var(--border,#d1d5db)] bg-[color:var(--background,#fff)] px-3 py-2 text-sm font-medium text-[color:var(--foreground,#111827)] hover:bg-[color:var(--muted,#f3f4f6)]"
            (click)="loadMoreVenues()"
          >
            Load more venues
          </button>
        }
      </section>
    </section>
  `,
})
export class EventPlannerComponent implements OnDestroy, AfterViewInit {
  private readonly fb = inject(FormBuilder);
  private readonly api = inject(EventPlannerService);
  private readonly destroyRef = inject(DestroyRef);

  readonly statuses: EventStatus[] = ['planned', 'scheduled', 'completed'];

  readonly venues = signal<Venue[]>([]);
  readonly events = signal<EventRecord[]>([]);

  readonly venueLoading = signal(false);
  readonly eventLoading = signal(false);

  readonly venueSubmitting = signal(false);
  readonly eventSubmitting = signal(false);

  readonly venueError = signal<string | null>(null);
  readonly eventError = signal<string | null>(null);

  readonly selectedVenue = signal<'all' | string>('all');

  readonly eventTotal = signal(0);

  readonly editingVenueId = signal<string | null>(null);
  readonly editingEventId = signal<string | null>(null);
  readonly deletingVenueId = signal<string | null>(null);
  readonly deletingEventId = signal<string | null>(null);

  readonly submitVenueLabel = computed(() =>
    this.editingVenueId() ? 'Update venue' : 'Save venue',
  );
  readonly submitEventLabel = computed(() =>
    this.editingEventId() ? 'Update event' : 'Schedule event',
  );

  readonly venueSortOptions = [
    { label: 'Name · A → Z', value: 'name:asc' },
    { label: 'Name · Z → A', value: 'name:desc' },
    { label: 'Capacity · High → Low', value: 'capacity:desc' },
    { label: 'Capacity · Low → High', value: 'capacity:asc' },
    { label: 'Recently Created', value: 'createdAt:desc' },
  ];

  readonly venueSearchTerm = signal('');
  readonly venueCityFilter = signal('');
  readonly venueSortOrder = signal<string>('name:asc');

  private readonly venueSearchChanges = new Subject<string>();
  private readonly venueCityChanges = new Subject<string>();

  @ViewChild('venuesLoader', { static: false })
  venuesLoader?: ElementRef<HTMLDivElement>;
  private venueObserver?: IntersectionObserver;

  readonly venuesInfiniteQuery = injectInfiniteQuery(() => ({
    queryKey: [
      'venues-directory',
      this.venueSearchTerm(),
      this.venueCityFilter(),
      this.venueSortOrder(),
    ],
    queryFn: async ({ pageParam }: { pageParam?: number }) => {
      const page =
        typeof pageParam === 'number' && pageParam > 0 ? pageParam : 1;
      return this.api.fetchVenuesPage({
        page,
        pageSize: 6,
        search: this.venueSearchTerm() || undefined,
        sort: this.venueSortOrder(),
        filter: {
          city: this.venueCityFilter() ? this.venueCityFilter() : undefined,
        },
      });
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (!lastPage?.hasMore) return undefined;
      if (typeof lastPage.nextPage === 'number') return lastPage.nextPage;
      return lastPage.page + 1;
    },
    keepPreviousData: true,
    refetchOnWindowFocus: false,
  }));

  readonly venuesInfiniteItems = computed(() => {
    const data = this.venuesInfiniteQuery.data();
    if (!data?.pages?.length) return [];
    return data.pages.flatMap((page) => page.items ?? []);
  });

  readonly venuesExplorerTotal = computed(() => {
    const data = this.venuesInfiniteQuery.data();
    if (!data?.pages?.length) return 0;
    const firstTotal = data.pages[0]?.total;
    if (typeof firstTotal === 'number') return firstTotal;
    const lastTotal = data.pages[data.pages.length - 1]?.total;
    return typeof lastTotal === 'number' ? lastTotal : 0;
  });

  readonly venuesInitialLoading = computed(() =>
    this.venuesInfiniteQuery.isPending(),
  );

  readonly venuesFetchingNext = computed(() =>
    this.venuesInfiniteQuery.isFetchingNextPage(),
  );

  readonly venuesHasMore = computed(
    () => this.venuesInfiniteQuery.hasNextPage() ?? false,
  );

  readonly venuesErrorMessage = computed(() => {
    const error = this.venuesInfiniteQuery.error();
    return error ? this.api.formatError(error) : null;
  });

  readonly venueForm = this.fb.group({
    name: this.fb.nonNullable.control('', [Validators.required, Validators.maxLength(120)]),
    city: this.fb.nonNullable.control('', [Validators.required, Validators.maxLength(120)]),
    capacity: new FormControl<number | null>(null, {
      validators: [Validators.min(0)],
      nonNullable: false,
    }),
  });

  readonly eventForm = this.fb.group({
    title: this.fb.nonNullable.control('', [Validators.required, Validators.maxLength(160)]),
    startDate: this.fb.nonNullable.control('', Validators.required),
    endDate: new FormControl<string | null>(null),
    status: this.fb.nonNullable.control<EventStatus>('planned', Validators.required),
    venueId: this.fb.nonNullable.control('', Validators.required),
  });

  readonly canScheduleEvents = computed(() => this.venues().length > 0);

  private readonly syncVenueSelection = effect(() => {
    if (!this.canScheduleEvents()) {
      this.eventForm.controls.venueId.setValue('');
      return;
    }
    const currentId = this.eventForm.controls.venueId.value;
    const knownIds = new Set(this.venues().map((v) => v.id));
    if (!currentId || !knownIds.has(currentId)) {
      const first = this.venues()[0];
      if (first) {
        this.eventForm.controls.venueId.setValue(first.id);
      }
    }
  });

  constructor() {
    this.venueSearchChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((value) => this.venueSearchTerm.set(value.trim()));

    this.venueCityChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((value) => this.venueCityFilter.set(value.trim()));

    this.refreshVenues();
    this.refreshEvents();
  }

  ngAfterViewInit(): void {
    this.setupVenueObserver();
  }

  ngOnDestroy(): void {
    this.venueObserver?.disconnect();
    this.venueSearchChanges.complete();
    this.venueCityChanges.complete();
  }

  onVenueSearchChanged(value: string) {
    this.venueSearchChanges.next(value ?? '');
  }

  onVenueCityChanged(value: string) {
    this.venueCityChanges.next(value ?? '');
  }

  onVenueSortChanged(value: string) {
    this.venueSortOrder.set(value);
  }

  loadMoreVenues() {
    if (!this.venuesInfiniteQuery.hasNextPage()) return;
    if (this.venuesInfiniteQuery.isFetchingNextPage()) return;
    this.venuesInfiniteQuery.fetchNextPage();
  }

  handleCreateVenue() {
    if (this.venueForm.invalid) {
      this.venueForm.markAllAsTouched();
      return;
    }

    const formValue = this.venueForm.value;
    const payload: CreateVenuePayload = {
      name: formValue.name?.trim() ?? '',
      city: formValue.city?.trim() ?? '',
      capacity:
        formValue.capacity !== null && formValue.capacity !== undefined
          ? Number(formValue.capacity)
          : undefined,
    };

    if (!payload.name || !payload.city) {
      this.venueForm.markAllAsTouched();
      return;
    }

    if (payload.capacity !== undefined && Number.isNaN(payload.capacity)) {
      payload.capacity = undefined;
    }

    const editingId = this.editingVenueId();
    const request$ = editingId
      ? this.api.updateVenue(editingId, payload as UpdateVenuePayload)
      : this.api.createVenue(payload);

    this.venueSubmitting.set(true);
    this.venueError.set(null);

    request$
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => this.venueSubmitting.set(false)),
      )
      .subscribe({
        next: (venue) => {
          const next = [...this.venues().filter((v) => v.id !== venue.id), venue].sort((a, b) =>
            a.name.localeCompare(b.name),
          );
          this.venues.set(next);
          this.editingVenueId.set(null);
          this.resetVenueForm();
          this.venuesInfiniteQuery.refetch();
          this.refreshVenues();
        },
        error: (err) => {
          this.venueError.set(this.api.formatError(err));
        },
      });
  }

  handleCreateEvent() {
    if (this.eventForm.invalid) {
      this.eventForm.markAllAsTouched();
      return;
    }

    const value = this.eventForm.value;

    const payload: CreateEventPayload = {
      title: value.title?.trim() ?? '',
      startDate: this.toIsoString(value.startDate),
      status: (value.status ?? 'planned') as EventStatus,
      venueId: value.venueId ?? '',
    };

    if (value.endDate) {
      const iso = this.toIsoString(value.endDate);
      if (iso) payload.endDate = iso;
    }

    if (!payload.title || !payload.startDate || !payload.venueId) {
      this.eventForm.markAllAsTouched();
      return;
    }

    const editingId = this.editingEventId();
    const request$ = editingId
      ? this.api.updateEvent(editingId, payload as UpdateEventPayload)
      : this.api.createEvent(payload);

    this.eventSubmitting.set(true);
    this.eventError.set(null);

    request$
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => this.eventSubmitting.set(false)),
      )
      .subscribe({
        next: () => {
          this.refreshEvents();
          this.editingEventId.set(null);
          this.resetEventForm();
        },
        error: (err) => {
          this.eventError.set(this.api.formatError(err));
        },
      });
  }

  handleVenueFilter(value: string) {
    this.selectedVenue.set(value);
    if (!this.editingEventId()) {
      if (value !== 'all') {
        this.eventForm.controls.venueId.setValue(value);
      } else if (this.venues().length > 0) {
        this.eventForm.controls.venueId.setValue(this.venues()[0].id);
      }
    }
    this.refreshEvents();
  }

  handleEditVenue(venue: Venue) {
    this.editingVenueId.set(venue.id);
    this.venueError.set(null);
    this.venueForm.patchValue({
      name: venue.name,
      city: venue.city,
      capacity: venue.capacity ?? null,
    });
  }

  handleCancelVenueEdit() {
    this.editingVenueId.set(null);
    this.venueError.set(null);
    this.resetVenueForm();
  }

  handleDeleteVenue(venue: Venue) {
    this.venueError.set(null);
    this.deletingVenueId.set(venue.id);
    this.api
      .deleteVenue(venue.id)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => this.deletingVenueId.set(null)),
      )
      .subscribe({
        next: () => {
          this.venues.set(this.venues().filter((v) => v.id !== venue.id));
          if (this.editingVenueId() === venue.id) {
            this.handleCancelVenueEdit();
          }
          if (this.selectedVenue() === venue.id) {
            this.selectedVenue.set('all');
          }
          this.venuesInfiniteQuery.refetch();
          this.refreshVenues();
          this.refreshEvents();
        },
        error: (err) => {
          this.venueError.set(this.api.formatError(err));
        },
      });
  }

  handleEditEvent(event: EventRecord) {
    this.editingEventId.set(event.id);
    this.eventError.set(null);
    this.eventForm.patchValue({
      title: event.title,
      startDate: this.toInputValue(event.startDate),
      endDate: event.endDate ? this.toInputValue(event.endDate) : null,
      status: event.status,
      venueId: event.venueId,
    });
  }

  handleCancelEventEdit() {
    this.editingEventId.set(null);
    this.eventError.set(null);
    this.resetEventForm();
  }

  handleDeleteEvent(event: EventRecord) {
    this.eventError.set(null);
    this.deletingEventId.set(event.id);
    this.api
      .deleteEvent(event.id)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => this.deletingEventId.set(null)),
      )
      .subscribe({
        next: () => {
          if (this.editingEventId() === event.id) {
            this.handleCancelEventEdit();
          }
          this.refreshEvents();
        },
        error: (err) => {
          this.eventError.set(this.api.formatError(err));
        },
      });
  }

  trackVenue(_: number, venue: Venue) {
    return venue.id;
  }

  trackEvent(_: number, event: EventRecord) {
    return event.id;
  }

  statusBadgeClass(status: EventStatus): string {
    switch (status) {
      case 'scheduled':
        return 'bg-blue-600';
      case 'completed':
        return 'bg-emerald-600';
      default:
        return 'bg-amber-600';
    }
  }

  formatDate(value?: string | null): string {
    if (!value) return '—';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return new Intl.DateTimeFormat(undefined, {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(date);
  }

  fallbackVenueName(venueId: string) {
    const match = this.venues().find((v) => v.id === venueId);
    return match ? `${match.name} · ${match.city}` : 'Unknown venue';
  }

  private resetVenueForm() {
    this.venueForm.reset({
      name: '',
      city: '',
      capacity: null,
    });
    this.venueForm.markAsPristine();
    this.venueForm.markAsUntouched();
  }

  private resetEventForm() {
    const defaultVenueId = this.selectedVenue() !== 'all'
      ? this.selectedVenue()
      : this.venues()[0]?.id ?? '';
    this.eventForm.reset({
      title: '',
      startDate: '',
      endDate: null,
      status: 'planned',
      venueId: defaultVenueId,
    });
    this.eventForm.markAsPristine();
    this.eventForm.markAsUntouched();
  }

  private toInputValue(value?: string | null): string {
    if (!value) return '';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return '';
    const offset = date.getTimezoneOffset();
    const local = new Date(date.getTime() - offset * 60000);
    return local.toISOString().slice(0, 16);
  }

  private setupVenueObserver() {
    if (!this.venuesLoader?.nativeElement) return;
    this.venueObserver?.disconnect();
    this.venueObserver = new IntersectionObserver((entries) => {
      const entry = entries.find((e) => e.isIntersecting);
      if (!entry) return;
      this.loadMoreVenues();
    });
    this.venueObserver.observe(this.venuesLoader.nativeElement);
  }

  private refreshVenues() {
    this.venueLoading.set(true);
    this.api
      .getVenues()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (venues) => {
          this.venues.set([...venues].sort((a, b) => a.name.localeCompare(b.name)));
        },
        error: (err) => {
          this.venueError.set(this.api.formatError(err));
        },
        complete: () => {
          this.venueLoading.set(false);
        },
      });
  }

  private refreshEvents() {
    this.eventLoading.set(true);
    const venueFilter = this.selectedVenue();
    this.api
      .getEvents({
        includeVenue: true,
        filter: {
          venueId: venueFilter !== 'all' ? venueFilter : undefined,
        },
      })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => {
          const sorted = [...(res.items ?? [])].sort((a, b) =>
            a.startDate.localeCompare(b.startDate),
          );
          this.events.set(sorted);
          this.eventTotal.set(res.total ?? sorted.length);
        },
        error: (err) => {
          this.eventError.set(this.api.formatError(err));
        },
        complete: () => {
          this.eventLoading.set(false);
        },
      });
  }

  private toIsoString(value?: string | null): string {
    if (!value) return '';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return '';
    return date.toISOString();
  }
}
