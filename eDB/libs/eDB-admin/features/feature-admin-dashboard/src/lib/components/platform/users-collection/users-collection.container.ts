import {
  CustomModalService,
  UiLoadingSpinnerComponent,
  UiPlatformOverflowMenuComponent,
  UiTableComponent,
} from '@edb/shared-ui';

import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  inject,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';

import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { AdminService } from '@eDB/client-admin';
import { TableUtilsService } from '@eDB/shared-utils';
import { UsersParamsService } from '@eDB/utils-user-params';

import { injectInfiniteQuery } from '@tanstack/angular-query-experimental';
import { TableModel } from 'carbon-components-angular';
import {
  combineLatest,
  debounceTime,
  map,
  Observable,
  startWith,
  Subject,
  takeUntil,
} from 'rxjs';

import { BreakpointObserver } from '@angular/cdk/layout';
import { PaginatedResponse } from '../../../types/paged-result.type';
import { SortEvent } from '../../../types/sort-event.type';
import { UserProfile } from '../../../types/user.type';
import { UsersCollectionAccordionComponent } from '../users-collection-mobile-accordion/users-collection-mobile-accordion';
import {
  MODAL_CONFIG,
  USER_ROW_MAPPER_CONFIG,
  USER_TABLE_COLUMNS,
} from './users-collection.container.config';

@Component({
  selector: 'platform-admin-users-collection',
  imports: [
    CommonModule,
    UiTableComponent,
    UiLoadingSpinnerComponent,
    UiPlatformOverflowMenuComponent,
    UsersCollectionAccordionComponent,
  ],
  template: `
    @if (isSmallScreen) {
      <section class="mx-4 mt-8 text-black">
        <h3 class="text-2xl">Users</h3>
        <p class="mt-2 mb-4">
          Manage platform users with pagination, search and sorting.
        </p>
        <platform-users-accordion
          [users]="(users$ | async) || []"
          (viewMoreId)="onViewMoreEvent($event)"
        ></platform-users-accordion>
      </section>
    } @else {
      @if (model$ | async; as model) {
        <ui-table
          title="User Management"
          description="Manage platform users with pagination, search and sorting."
          [model]="model"
          [sortable]="true"
          [showToolbar]="true"
          [searchTerm]="searchTerm"
          (searchChanged)="onSearchChanged($event)"
          (sortChanged)="onSortChanged($event)"
        ></ui-table>
      }
    }

    <ng-template #actionsTemplate let-data="data">
      <div>
        <ui-platform-overflow-menu
          [menuOptions]="menuOptions"
          icon="faEllipsisV"
          iconColor="black"
          (menuOptionSelected)="onMenuOptionSelected($event, data)"
        ></ui-platform-overflow-menu>
      </div>
    </ng-template>

    <div id="loader" #loader></div>

    <div class="feedback-messages">
      @if (isFetching$ | async) {
        <section class="loading-spinner">
          <ui-loading [isActive]="true" />
          <p>Loading...</p>
        </section>
      }

      @if (!(hasMore$ | async)) {
        <section class="no-more-users">
          <p>No more users to load.</p>
        </section>
      }

      @if (error$ | async; as error) {
        <p>Error: {{ error.message }}</p>
      }
    </div>
  `,
  styleUrls: ['users-collection.container.scss'],
})
export class UsersCollectionContainer implements OnInit, OnDestroy {
  private breakpointObserver = inject(BreakpointObserver);
  isSmallScreen = false;
  @ViewChild('actionsTemplate', { static: true })
  actionsTemplate!: TemplateRef<any>;

  @ViewChild('loader', { static: true }) loaderElement!: ElementRef;

  menuOptions = [
    { id: 'view', label: 'View More' },
    { id: 'delete', label: 'Delete User' },
  ];
  searchTerm = '';

  private destroy$ = new Subject<void>();
  private sortChange$ = new Subject<SortEvent>();
  private searchChange$ = new Subject<string>();

  private adminService = inject(AdminService);
  private modalUtils = inject(CustomModalService);
  private usersParamsService = inject(UsersParamsService);
  private tableUtilsService = inject(TableUtilsService);
  private router = inject(Router);

  onViewMoreEvent(id: number): void {
    this.router.navigate(['/users', id]);
  }

  private searchParam = toSignal(this.usersParamsService.query$, {
    initialValue: '',
  });
  private sortParam = toSignal(this.usersParamsService.sort$, {
    initialValue: 'id,asc',
  });

  deleteUserMutation = this.adminService.deleteUserMutation();

  constructor() {
    this.searchTerm = this.searchParam();
  }

  ngOnInit(): void {
    this.observeSortChanges();
    this.observeSearchChanges();
    this.observeLoader();

    this.breakpointObserver
      .observe(['(max-width: 768px)'])
      .subscribe((result) => {
        this.isSmallScreen = result.matches;
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // INFINITE QUERY

  private usersQuery = injectInfiniteQuery(() => ({
    queryKey: ['users', this.searchParam(), this.sortParam()],
    queryFn: ({ pageParam }: { pageParam: string | number | null }) => {
      return this.adminService.queryAllUsers(
        pageParam, // Pass the entire pageParam directly
        this.searchParam(),
        this.sortParam(),
      );
    },
    getNextPageParam: (lastPage: PaginatedResponse<UserProfile>) => {
      if (!lastPage.hasMore || lastPage.data.length === 0) {
        return null;
      }

      const [uiSortField, sortDirection] = this.sortParam().split(',') as [
        string,
        'asc' | 'desc',
      ];
      const sortField = this.adminService.mapSortFieldToBackend(uiSortField);
      const lastItem = lastPage.data[lastPage.data.length - 1];
      const value = lastItem[sortField];

      const cursor = value;
      return cursor;
    },
    initialPageParam: null,
    keepPreviousData: false,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    cacheTime: 0, // Cache is cleared immediately
    staleTime: 0,
  }));

  protected users$: Observable<UserProfile[]> = toObservable(
    this.usersQuery.data,
  ).pipe(
    map(
      (infiniteData) => infiniteData?.pages.flatMap((page) => page.data) || [],
    ),
    startWith([]),
  );

  protected isFetching$: Observable<boolean> = toObservable(
    this.usersQuery.isFetching,
  ).pipe(map((value) => !!value));

  protected hasMore$: Observable<boolean> = toObservable(
    this.usersQuery.hasNextPage,
  ).pipe(map((value) => !!value));

  protected error$: Observable<Error | null> = toObservable(
    this.usersQuery.error,
  ).pipe(
    map((error) => {
      if (error) {
        console.error('Error fetching users:', error);
        return new Error('Failed to fetch users. Please try again later.');
      }
      return null;
    }),
  );

  // TABLE

  protected model$: Observable<TableModel> = combineLatest([
    this.users$,
    toObservable(this.sortParam),
  ]).pipe(
    map(([data, sortParam]) => {
      const [uiSortField, sortDirection] = sortParam.split(',');

      // Generate headers with sorting metadata
      const headers = this.tableUtilsService.getTableHeaders(
        USER_TABLE_COLUMNS,
        uiSortField,
        sortDirection as 'asc' | 'desc',
      );
      // Generate rows
      const rows = this.tableUtilsService.prepareData(
        data,
        USER_ROW_MAPPER_CONFIG,
        this.actionsTemplate,
      );

      // Construct the table model
      const model = new TableModel();
      model.header = headers;
      model.data = rows;

      return model;
    }),
  );

  onMenuOptionSelected(action: string, user: UserProfile): void {
    if (action === 'view') {
      this.router.navigate([`/users/${user.id}`]);
    } else if (action === 'delete') {
      this.router.navigateByUrl(this.router.url, { replaceUrl: true });
      this.openDeleteConfirmationModal(user);
    }
  }

  onDeleteUser(userId: number) {
    this.deleteUserMutation.mutate(userId, {
      onSuccess: () => {
        console.log('Application deleted successfully');
      },
      onError: (error) => {
        console.error('Failed to add application:', error);
      },
    });
  }

  // OBSERVATIONS

  private observeSortChanges(): void {
    this.sortChange$
      .pipe(debounceTime(300), takeUntil(this.destroy$))
      .subscribe((sort: SortEvent) => {
        const sortParam = `${sort.sortField},${sort.sortDirection}`;
        this.usersParamsService.navigate({
          sort: sortParam,
          search: this.searchParam(),
        });
      });
  }

  private observeSearchChanges(): void {
    this.searchChange$
      .pipe(debounceTime(300), takeUntil(this.destroy$))
      .subscribe((search: string) => {
        this.usersParamsService.navigate({
          search,
          sort: this.sortParam(),
        });
      });
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

  // MODALS
  openDeleteConfirmationModal(user: UserProfile): void {
    this.modalUtils.openModal({
      ...MODAL_CONFIG.deleteUser(user.firstName),
      onSave: () => this.onDeleteUser(user.id),
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

  fetchNextPage(): void {
    if (this.usersQuery.hasNextPage()) {
      this.usersQuery.fetchNextPage();
    }
  }
}
