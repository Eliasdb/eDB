// components/admin/admin-container.ts

import { CommonModule } from '@angular/common';
import {
  Component,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewChild,
  inject,
} from '@angular/core';
import {
  UiContentSwitcherComponent,
  UiLoadingSpinnerComponent,
  UiPlatformOverflowMenuComponent,
  UiTableComponent,
} from '@eDB/shared-ui';
import {
  TableHeaderItem,
  TableItem,
  TableModel,
} from 'carbon-components-angular';
import { BehaviorSubject, Subscription, combineLatest } from 'rxjs';
import { filter, switchMap, tap } from 'rxjs/operators';
import { SortEvent } from '../../../models/sort-event.model';
import { UserProfile } from '../../../models/user.model';
import { AdminService } from '../../../services/admin-service/admin.service';

interface SortParams {
  sortField: string;
  sortDirection: 'asc' | 'desc';
}

@Component({
  standalone: true,
  selector: 'platform-admin',
  imports: [
    CommonModule,
    UiContentSwitcherComponent,
    UiTableComponent,
    UiPlatformOverflowMenuComponent,
    UiLoadingSpinnerComponent,
  ],
  template: `
    <section class="admin-page" (scroll)="onTableScroll($event)">
      <ui-content-switcher [optionsArray]="['Users', 'Subscriptions']">
        <!-- Users Section -->
        <div section1>
          <div class="table-container">
            <ui-table
              [title]="'User Management'"
              [description]="'Manage users and their roles.'"
              [model]="tableModel"
              [sortable]="true"
              [showPagination]="false"
              [skeleton]="false"
              (rowClicked)="onRowClick($event)"
              (sortChanged)="onSortChanged($event)"
            ></ui-table>
            <!-- Loading spinner at the bottom -->
            <ui-loading
              [isActive]="loadingMore"
              [size]="'sm'"
              [overlay]="false"
            ></ui-loading>
          </div>

          <!-- Overflow Menu Template -->
          <ng-template #overflowTemplate let-user="data">
            <ui-platform-overflow-menu
              [menuOptions]="menuOptions"
              [icon]="'faEllipsisVertical'"
              (menuOptionSelected)="onOverflowMenuSelect($event, user)"
            ></ui-platform-overflow-menu>
          </ng-template>
        </div>

        <!-- Subscriptions Section -->
        <div section2>
          <h2>Subscriptions</h2>
          <p>Manage your subscriptions here.</p>
        </div>
      </ui-content-switcher>
    </section>
  `,
  styles: [
    `
      .admin-page {
        height: 100vh;
        padding: 4rem;
        padding-top: 6rem;
        overflow-y: auto;
      }
      .table-container {
        position: relative;
      }
      .no-more-data {
        text-align: center;
        padding: 1rem;
        color: #666;
      }
    `,
  ],
})
export class AdminContainer implements OnInit, OnDestroy {
  private adminService = inject(AdminService);

  // Consolidated sorting state
  private sortParams$ = new BehaviorSubject<SortParams>({
    sortField: 'Id',
    sortDirection: 'asc',
  });

  private pageParam$ = new BehaviorSubject<number>(1);

  private dataSubscription!: Subscription;

  tableModel = new TableModel();

  loading = true; // Initial loading state
  loadingMore = false; // Loading more data

  @ViewChild('overflowTemplate', { static: true })
  overflowTemplate!: TemplateRef<any>;

  menuOptions = [{ id: 'delete', label: 'Delete' }];

  private allUsers: UserProfile[] = []; // Accumulated users for infinite scrolling

  // Flags to manage fetching state
  private hasMore: boolean = true;
  private isLoading: boolean = false;

  constructor() {
    this.tableModel.data = []; // Initialize as empty array
  }

  ngOnInit() {
    this.initializeTableHeaders();

    // Combine sortParams and pageParam to fetch data
    this.dataSubscription = combineLatest([this.sortParams$, this.pageParam$])
      .pipe(
        // Only proceed if there are more pages and not currently loading
        filter(() => this.hasMore && !this.isLoading),
        tap(([sortParams, pageParam]) => {
          console.log(
            `Fetching data - SortField: ${sortParams.sortField}, SortDirection: ${sortParams.sortDirection}, Page: ${pageParam}`
          );
          // Set loading state
          this.isLoading = true;
          if (pageParam === 1) {
            this.loading = true;
            this.allUsers = []; // Clear existing users for fresh fetch
            this.tableModel.data = [];
          } else {
            this.loadingMore = true;
          }
        }),
        switchMap(([sortParams, pageParam]) =>
          this.fetchData(
            sortParams.sortField,
            sortParams.sortDirection,
            pageParam
          )
        )
      )
      .subscribe({
        next: () => {
          // No action needed here as fetchData handles updating the table
        },
        error: (err) => {
          console.error('Unexpected Error:', err);
          // Handle unexpected errors here
          this.isLoading = false;
          this.loading = false;
          this.loadingMore = false;
        },
      });

    // Initial fetch is triggered automatically due to BehaviorSubjects emitting their initial values
  }

  ngOnDestroy() {
    this.dataSubscription.unsubscribe();
  }

  initializeTableHeaders(): void {
    this.tableModel.header = [
      new TableHeaderItem({
        data: 'ID',
        sortable: true,
        metadata: { sortField: 'Id' },
      }),
      new TableHeaderItem({
        data: 'Name',
        sortable: true,
        metadata: { sortField: 'FirstName' },
      }),
      new TableHeaderItem({
        data: 'Email',
        sortable: true,
        metadata: { sortField: 'Email' },
      }),
      new TableHeaderItem({
        data: 'Role',
        sortable: true,
        metadata: { sortField: 'Role' },
      }),
      new TableHeaderItem({
        data: 'State/Province',
        sortable: true,
        metadata: { sortField: 'State' },
      }),
      new TableHeaderItem({ data: '', sortable: false }), // Overflow menu
    ];
  }

  fetchData(
    sortField: string,
    sortDirection: 'asc' | 'desc',
    pageParam: number
  ) {
    console.log(
      `Initiating fetch for page ${pageParam} with sort ${sortField} ${sortDirection}`
    );

    return this.adminService
      .fetchUsersPage(sortField, sortDirection, pageParam)
      .pipe(
        tap((pagedResult) => {
          console.log(`Received data for page ${pageParam}:`, pagedResult);
          // Update loading states
          this.isLoading = false;
          if (pageParam === 1) {
            this.loading = false;
            this.allUsers = pagedResult.items;
          } else {
            this.loadingMore = false;
            this.allUsers = [...this.allUsers, ...pagedResult.items];
          }

          this.updateTableData(this.allUsers);

          // Update hasMore based on the response
          this.hasMore = pagedResult.hasMore;
          console.log(`hasMore set to: ${this.hasMore}`);
        })
      );
  }

  updateTableData(users: UserProfile[]): void {
    this.tableModel.data = this.prepareData(users);
    this.tableModel.totalDataLength = this.tableModel.data.length;
  }

  prepareData(users: UserProfile[]): TableItem[][] {
    return users
      .filter(
        (user) =>
          user.id &&
          user.firstName &&
          user.lastName &&
          user.email &&
          user.country &&
          user.state &&
          user.role !== undefined
      ) // Ensure all necessary fields are present
      .map((user) => [
        new TableItem({ data: user.id }), // ID
        new TableItem({ data: `${user.firstName} ${user.lastName}` }), // Name
        new TableItem({ data: user.email }), // Email
        new TableItem({ data: user.role }), // Role
        new TableItem({ data: user.state }), // State/Province
        new TableItem({
          data: user,
          template: this.overflowTemplate,
        }), // Overflow menu
      ]);
  }

  onTableScroll(event: Event): void {
    const target = event.target as HTMLElement;
    const threshold = target.scrollHeight - target.clientHeight - 50; // 50px before bottom
    if (target.scrollTop > threshold) {
      console.log('Scroll threshold reached. Attempting to load next page.');
      // Check if more pages are available and not currently loading
      if (this.hasMore && !this.isLoading) {
        const nextPage = this.pageParam$.value + 1;
        console.log(`Loading next page: ${nextPage}`);
        this.pageParam$.next(nextPage);
      } else {
        console.log('No more pages to load or already loading.');
      }
    }
  }

  onRowClick(index: number): void {
    const user = this.tableModel.data[index][5].data as UserProfile; // Adjusted index
    console.log('Row clicked:', user);
    // You can navigate to a user detail page or perform other actions here
  }

  onOverflowMenuSelect(actionId: string, user: UserProfile): void {
    if (actionId === 'delete') {
      this.deleteUser(user.id.toString());
    }
  }

  deleteUser(userId: string): void {
    // Implement deletion logic here
    console.log(`Deleting user with ID: ${userId}`);
    // Example: Call the adminService to delete the user and then refresh the table
  }

  /**
   * Handles the sortChanged event emitted by the UiTableComponent.
   * @param sort The sort event containing sortField and sortDirection.
   */
  onSortChanged(sort: SortEvent): void {
    console.log(
      `Sort changed: Field=${sort.sortField}, Direction=${sort.sortDirection}`
    );
    // Update sortParams
    this.sortParams$.next({
      sortField: sort.sortField,
      sortDirection: sort.sortDirection,
    });

    // Reset page to 1
    this.pageParam$.next(1);

    // Reset hasMore to true to allow fetching the first page
    this.hasMore = true;

    // Optionally, clear existing data
    this.allUsers = [];
    this.tableModel.data = [];
  }
}
