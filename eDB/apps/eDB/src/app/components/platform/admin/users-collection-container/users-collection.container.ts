// users-collection.container.ts

import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  inject,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { SharedModule } from '@eDB/shared-utils';
import {
  InfiniteData,
  injectInfiniteQuery,
  QueryClient,
} from '@tanstack/angular-query-experimental';
import {
  TableHeaderItem,
  TableItem,
  TableModel,
} from 'carbon-components-angular';
import {
  SortEvent,
  UiTableComponent,
} from 'libs/ui/src/lib/components/tables/table/table.component';
import {
  combineLatest,
  debounceTime,
  map,
  Observable,
  startWith,
  Subject,
  takeUntil,
} from 'rxjs';
import { PaginatedResponse } from '../../../../models/paged-result.model';
import { UserProfile } from '../../../../models/user.model';
import { AdminService } from '../../../../services/admin-service/admin.service';
import { UserParamService } from '../../../../services/users-params-service/users-params.service';

const STRING_SORT_FIELDS = ['firstname', 'lastname', 'email', 'role'] as const;
type StringSortField = (typeof STRING_SORT_FIELDS)[number];

@Component({
  selector: 'platform-admin-users-collection',
  standalone: true,
  imports: [CommonModule, UiTableComponent, SharedModule],
  template: `
    <section
      class="cont"
      infiniteScroll
      [isFetching]="isFetching$ | async"
      [hasMore]="hasMore$ | async"
      (scrolled)="fetchNextPage()"
    >
      <div>
        <ui-table
          *ngIf="model$ | async as model"
          title="User Management"
          description="Manage platform users with pagination and sorting."
          [model]="model"
          [sortable]="true"
          [showPagination]="false"
          [showToolbar]="true"
          [showButton]="false"
          [searchTerm]="searchTerm"
          (searchChanged)="onSearchChanged($event)"
          (sortChanged)="onSortChanged($event)"
          (rowClicked)="onRowClicked($event)"
        ></ui-table>
        <div id="loader" #loader></div>

        <div class="feedback-messages">
          <p *ngIf="isFetching$ | async">Loading...</p>
          <p *ngIf="!(hasMore$ | async)">You've reached the end!</p>
          <p *ngIf="error$ | async as error">Error: {{ error.message }}</p>
        </div>
      </div>
    </section>
  `,
  styleUrls: ['users-collection.container.scss'],
})
export class UsersCollectionContainer implements OnInit, OnDestroy {
  private adminService = inject(AdminService);
  private userParamService = inject(UserParamService);
  private destroy$ = new Subject<void>();
  private queryClient = inject(QueryClient);

  private sortChange$ = new Subject<SortEvent>();
  private searchChange$ = new Subject<string>();

  @ViewChild('loader', { static: true }) loaderElement!: ElementRef;

  searchTerm = '';

  private searchParam = toSignal(this.userParamService.query$, {
    initialValue: '',
  });
  private sortParam = toSignal(this.userParamService.sort$, {
    initialValue: 'id,asc',
  });

  private usersQuery = injectInfiniteQuery(() => ({
    queryKey: ['users', this.searchParam(), this.sortParam()],
    queryFn: ({ pageParam }: { pageParam: string | number | null }) => {
      console.log(`Fetching users with cursor: ${pageParam}`); // Debugging
      return this.adminService.queryUsers(
        pageParam, // Pass the entire pageParam directly
        this.searchParam(),
        this.sortParam()
      );
    },
    getNextPageParam: (lastPage: PaginatedResponse<UserProfile>) => {
      const [uiSortField, sortDirection] = this.sortParam().split(',') as [
        string,
        'asc' | 'desc'
      ];

      const sortField = this.mapSortField(uiSortField);

      if (!lastPage.hasMore || lastPage.data.length === 0) {
        return null;
      }

      const lastItem = lastPage.data[lastPage.data.length - 1];

      let cursor: string | number;

      if (STRING_SORT_FIELDS.includes(uiSortField as StringSortField)) {
        // Composite cursor for string fields
        const value = lastItem[sortField];
        if (value === undefined || value === null) {
          console.error(
            `Sort field '${sortField}' is undefined or null for user with id ${lastItem.id}.`
          );
          return null;
        }
        cursor = JSON.stringify({
          value: value,
          id: lastItem.id,
        });
      } else {
        // Simple cursor for numeric fields
        const value = lastItem[sortField];
        if (value === undefined || value === null) {
          console.error(
            `Sort field '${sortField}' is undefined or null for user with id ${lastItem.id}.`
          );
          return null;
        }
        cursor = value;
      }

      console.log(`Next cursor for sort '${sortDirection}': ${cursor}`);

      return cursor;
    },
    initialPageParam: null, // Start with the first page
    keepPreviousData: false,
  }));

  protected users$: Observable<UserProfile[]> = toObservable(
    this.usersQuery.data
  ).pipe(
    map(
      (
        infiniteData: InfiniteData<PaginatedResponse<UserProfile>> | undefined
      ) => infiniteData?.pages.flatMap((page) => page.data) || []
    ),
    startWith([])
  );

  protected model$: Observable<TableModel> = combineLatest([
    this.users$,
    toObservable(this.sortParam),
  ]).pipe(
    map(([data, sortParam]) => {
      const [uiSortField, sortDirection] = sortParam.split(',');

      const sortField = this.mapSortField(uiSortField);

      const model = new TableModel();
      model.header = [
        new TableHeaderItem({
          data: 'ID',
          metadata: { sortField: 'id' },
          sortable: true,
          sorted: uiSortField === 'id',
          ascending: sortDirection === 'asc',
        }),
        new TableHeaderItem({
          data: 'First Name',
          metadata: { sortField: 'firstname' },
          sortable: true,
          sorted: uiSortField === 'firstname',
          ascending: sortDirection === 'asc',
        }),
        new TableHeaderItem({
          data: 'Last Name',
          metadata: { sortField: 'lastname' },
          sortable: true,
          sorted: uiSortField === 'lastname',
          ascending: sortDirection === 'asc',
        }),
        new TableHeaderItem({
          data: 'Email',
          metadata: { sortField: 'email' },
          sortable: true,
          sorted: uiSortField === 'email',
          ascending: sortDirection === 'asc',
        }),
        new TableHeaderItem({
          data: 'Role',
          metadata: { sortField: 'role' },
          sortable: true,
          sorted: uiSortField === 'role',
          ascending: sortDirection === 'asc',
        }),
      ];

      model.data = data.map((user) => [
        new TableItem({ data: user.id }),
        new TableItem({ data: user.firstName }),
        new TableItem({ data: user.lastName }),
        new TableItem({ data: user.email }),
        new TableItem({ data: user.role }),
      ]);

      return model;
    })
  );

  protected isFetching$: Observable<boolean> = toObservable(
    this.usersQuery.isFetching
  ).pipe(map((value) => !!value));

  protected hasMore$: Observable<boolean> = toObservable(
    this.usersQuery.hasNextPage
  ).pipe(map((value) => !!value));

  protected error$: Observable<Error | null> = toObservable(
    this.usersQuery.error
  ).pipe(
    map((error) => {
      if (error) {
        console.error('Error fetching users:', error);
        return new Error('Failed to fetch users. Please try again later.');
      }
      return null;
    })
  );

  constructor() {
    this.searchTerm = this.searchParam();
  }

  ngOnInit(): void {
    this.observeSortChanges();
    this.observeSearchChanges();
    this.observeLoader();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private observeSortChanges(): void {
    this.sortChange$
      .pipe(debounceTime(300), takeUntil(this.destroy$))
      .subscribe((sort: SortEvent) => {
        const sortParam = `${sort.sortField},${sort.sortDirection}`;
        this.userParamService.navigate({
          sort: sortParam,
          search: this.searchParam(),
        });
        // Removed invalidateQueries to prevent redundant API calls
      });
  }

  private observeSearchChanges(): void {
    this.searchChange$
      .pipe(debounceTime(300), takeUntil(this.destroy$))
      .subscribe((search: string) => {
        this.userParamService.navigate({
          search,
          sort: this.sortParam(),
        });
        // Removed invalidateQueries to prevent redundant API calls
      });
  }

  onSortChanged(sort: SortEvent): void {
    this.sortChange$.next(sort);
  }

  onSearchChanged(query: string): void {
    if (this.searchTerm !== query) {
      this.searchTerm = query;
      this.searchChange$.next(query);
    }
  }

  onRowClicked(index: number): void {
    console.log(`Row clicked at index: ${index}`);
  }

  fetchNextPage(): void {
    if (this.usersQuery.hasNextPage()) {
      this.usersQuery.fetchNextPage();
    }
  }

  private observeLoader(): void {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        this.fetchNextPage();
      }
    });

    if (this.loaderElement) {
      observer.observe(this.loaderElement.nativeElement);
    } else {
      console.error('Loader element not found');
    }

    this.destroy$.pipe(takeUntil(this.destroy$)).subscribe(() => {
      observer.disconnect();
    });
  }

  private mapSortField(sortField: string): keyof UserProfile {
    const fieldMapping: { [key: string]: keyof UserProfile } = {
      firstname: 'firstName',
      lastname: 'lastName',
      email: 'email',
      role: 'role',
      id: 'id',
    };
    return fieldMapping[sortField.toLowerCase()] || 'id';
  }
}
