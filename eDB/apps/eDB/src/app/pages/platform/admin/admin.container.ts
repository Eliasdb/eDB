import { CommonModule } from '@angular/common';
import {
  Component,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewChild,
  inject,
} from '@angular/core';
import { UiContentSwitcherComponent } from '@eDB/shared-ui';
import {
  TableHeaderItem,
  TableItem,
  TableModel,
} from 'carbon-components-angular';
import { BehaviorSubject, Subscription, combineLatest } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { PlatformAdminUserManagementComponent } from '../../../components/platform/admin-user-management/admin-user-management';
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
    PlatformAdminUserManagementComponent,
  ],
  template: `
    <section class="admin-page" (scroll)="onTableScroll($event)">
      <ui-content-switcher [optionsArray]="['Users', 'Subscriptions']">
        <!-- Users Section -->
        <div section1>
          <platform-admin-user-management
            [tableModel]="tableModel"
            [loading]="loading"
            [loadingMore]="loadingMore"
            [hasMore]="hasMore"
            [menuOptions]="menuOptions"
            (rowClicked)="onRowClick($event)"
            (sortChanged)="onSortChanged($event)"
            (overflowMenuSelect)="
              onOverflowMenuSelect($event.actionId, $event.user)
            "
          ></platform-admin-user-management>
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
    `,
  ],
})
export class AdminContainer implements OnInit, OnDestroy {
  private adminService = inject(AdminService);

  // Consolidated sorting state
  private sortParams$ = new BehaviorSubject<SortParams>({
    sortField: 'id',
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
  protected hasMore: boolean = true;
  private isLoading: boolean = false;

  constructor() {
    this.tableModel.data = []; // Initialize as empty array
  }

  ngOnInit() {
    this.initializeTableHeaders();

    // Combine sortParams and pageParam to fetch data
    const fetchParams$ = combineLatest([this.sortParams$, this.pageParam$]);

    // Use switchMap to handle data fetching
    this.dataSubscription = fetchParams$
      .pipe(
        tap(([sortParams, pageParam]) => {
          console.log(
            `Fetching data - SortField: ${sortParams.sortField}, SortDirection: ${sortParams.sortDirection}, Page: ${pageParam}`
          );
          this.isLoading = true;

          if (pageParam === 1) {
            this.loading = true;
            // Clear existing users only if fetching
            this.allUsers = [];
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
          // Data fetch successful
        },
        error: (err) => {
          console.error('Unexpected Error:', err);
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
        metadata: { sortField: 'id', backendSortField: 'Id' },
      }),
      new TableHeaderItem({
        data: 'Name',
        sortable: true,
        metadata: { sortField: 'Name', backendSortField: 'FirstName' },
      }),
      new TableHeaderItem({
        data: 'Email',
        sortable: true,
        metadata: { sortField: 'email', backendSortField: 'Email' },
      }),
      new TableHeaderItem({
        data: 'Role',
        sortable: true,
        metadata: { sortField: 'role', backendSortField: 'Role' },
      }),
      new TableHeaderItem({
        data: 'State/Province',
        sortable: true,
        metadata: { sortField: 'state', backendSortField: 'State' },
      }),
      new TableHeaderItem({ data: '', sortable: false }), // Overflow menu
    ];
  }

  fetchData(
    sortField: string,
    sortDirection: 'asc' | 'desc',
    pageParam: number
  ) {
    // Map 'Name' to 'FirstName' for backend
    const backendSortField =
      sortField === 'Name'
        ? 'FirstName'
        : this.tableModel.header.find(
            (item) => item.metadata?.sortField === sortField
          )?.metadata?.backendSortField || sortField;

    console.log(
      `Initiating fetch for page ${pageParam} with sort ${backendSortField} ${sortDirection}`
    );

    return this.adminService
      .fetchUsersPage(backendSortField, sortDirection, pageParam)
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
    console.log('Received SortEvent:', sort);

    const sortField = sort.sortField;
    const headerItem = this.tableModel.header.find(
      (item) => item.metadata?.sortField === sortField
    );

    const backendSortField =
      headerItem?.metadata?.backendSortField || sortField;

    if (this.hasMore) {
      // Fetch sorted data from the server if not all data is loaded
      // Update the sort parameters
      this.sortParams$.next({
        sortField: backendSortField,
        sortDirection: sort.sortDirection,
      });
      this.pageParam$.next(1); // Reset to the first page
      this.allUsers = []; // Clear existing data
      this.tableModel.data = []; // Clear the table
    } else {
      // Perform client-side sorting when all data is loaded
      this.sortAllUsers(sortField, sort.sortDirection);
    }
  }

  /**
   * Sorts the allUsers array locally when all data has been fetched.
   * @param sortField The field to sort by.
   * @param sortDirection The direction to sort ('asc' or 'desc').
   */
  sortAllUsers(sortField: string, sortDirection: 'asc' | 'desc'): void {
    console.log(`Sorting on field: ${sortField} in ${sortDirection} order`);
    const sortedUsers = [...this.allUsers].sort((a, b) => {
      let fieldA: any;
      let fieldB: any;

      // Handle composite 'Name' field
      if (sortField === 'Name') {
        fieldA = `${a.firstName} ${a.lastName}`.toLowerCase();
        fieldB = `${b.firstName} ${b.lastName}`.toLowerCase();
      } else {
        fieldA = (a as any)[sortField];
        fieldB = (b as any)[sortField];
      }

      if (fieldA == null || fieldB == null) {
        return 0; // Handle missing fields gracefully
      }

      // Determine the field type
      const fieldType = typeof fieldA;

      if (fieldType === 'string') {
        fieldA = fieldA.toLowerCase();
        fieldB = fieldB.toLowerCase();
        return sortDirection === 'asc'
          ? fieldA.localeCompare(fieldB)
          : fieldB.localeCompare(fieldA);
      } else if (fieldType === 'number') {
        return sortDirection === 'asc' ? fieldA - fieldB : fieldB - fieldA;
      } else {
        // For other types, convert to string
        fieldA = fieldA.toString();
        fieldB = fieldB.toString();
        return sortDirection === 'asc'
          ? fieldA.localeCompare(fieldB)
          : fieldB.localeCompare(fieldA);
      }
    });

    console.log(`Sorted allUsers by ${sortField} (${sortDirection})`);

    // Update the table with the sorted data
    this.updateTableData(sortedUsers);
  }
}
