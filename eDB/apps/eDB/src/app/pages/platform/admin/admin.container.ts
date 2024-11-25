import { CommonModule } from '@angular/common';
import {
  Component,
  TemplateRef,
  ViewChild,
  effect,
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
import { UserProfile } from '../../../models/user.model';
import { AdminService } from '../../../services/admin-service/admin.service';

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
          <ng-container *ngIf="usersQuery.isSuccess()">
            <div class="table-container">
              <ui-table
                [title]="'User Management'"
                [description]="'Manage users and their roles.'"
                [model]="tableModel"
                [sortable]="true"
                [showPagination]="false"
                [skeleton]="skeleton"
                (rowClicked)="onRowClick($event)"
              ></ui-table>
              <!-- Loading spinner at the bottom -->
              <ui-loading
                [isActive]="usersQuery.isFetchingNextPage()"
                [size]="'sm'"
                [overlay]="false"
              ></ui-loading>
            </div>
          </ng-container>

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
        padding-top: 6rem;
        overflow-y: auto;
        padding: 4rem;
      }
      .table-container {
        position: relative;
      }
    `,
  ],
})
export class AdminContainer {
  private adminService = inject(AdminService);

  usersQuery = this.adminService.fetchUsers();
  tableModel = new TableModel();

  skeleton = true; // Default to showing skeleton initially

  @ViewChild('overflowTemplate', { static: true })
  overflowTemplate!: TemplateRef<any>;

  menuOptions = [{ id: 'delete', label: 'Delete' }];

  constructor() {
    this.tableModel.data = []; // Initialize as empty array
    effect(() => {
      // Toggle skeleton based on loading state
      this.skeleton = this.usersQuery.isLoading();

      if (this.usersQuery.isSuccess()) {
        const data = this.usersQuery.data();
        if (data) {
          const users = data.pages.flatMap((page) => page.items);
          this.initializeTable(users);
          this.skeleton = false; // Hide skeleton when data is ready
        }
      }
    });
  }

  initializeTable(users: UserProfile[]): void {
    this.tableModel.header = [
      new TableHeaderItem({ data: 'ID' }),
      new TableHeaderItem({ data: 'Name' }),
      new TableHeaderItem({ data: 'Email' }),
      new TableHeaderItem({ data: 'Role' }),
      new TableHeaderItem({ data: 'State/Province' }),
      new TableHeaderItem({ data: '', sortable: false }), // Overflow menu
    ];
    this.tableModel.data = this.prepareData(users); // Set data directly
    this.tableModel.totalDataLength = this.tableModel.data.length;
  }

  updateTableData(users: UserProfile[]): void {
    const newData = this.prepareData(users).filter((row) => row.length > 0); // Filter out any empty rows
    this.tableModel.data = [...this.tableModel.data, ...newData];
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
        new TableItem({ data: user, template: this.overflowTemplate }), // Overflow menu
      ]);
  }

  onTableScroll(event: Event): void {
    const target = event.target as HTMLElement;
    const threshold = target.scrollHeight - target.clientHeight - 50; // 50px before bottom
    if (target.scrollTop > threshold) {
      if (
        this.usersQuery.hasNextPage() &&
        !this.usersQuery.isFetchingNextPage()
      ) {
        this.usersQuery.fetchNextPage();
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
      this.deleteUser(user.firstName);
    }
  }

  deleteUser(userId: string): void {
    // Implement deletion logic here
    console.log(`Deleting user with ID: ${userId}`);
    // Example: Call the adminService to delete the user and then refresh the table
  }
}
