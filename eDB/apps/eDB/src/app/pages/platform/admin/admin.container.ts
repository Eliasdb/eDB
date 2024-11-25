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
  ],
  template: `
    <ui-content-switcher [optionsArray]="['Users', 'Subscriptions']">
      <!-- Users Section -->
      <div section1>
        <ng-container *ngIf="usersQuery.isSuccess(); else loadingOrError">
          <div class="table-container" (scroll)="onTableScroll($event)">
            <ui-table
              [title]="'User Management'"
              [description]="'Manage users and their roles.'"
              [model]="tableModel"
              [sortable]="true"
              [isDataGrid]="false"
              [showPagination]="false"
              (rowClicked)="onRowClick($event)"
            ></ui-table>
          </div>
          <div *ngIf="usersQuery.isFetchingNextPage()">
            Loading more users...
          </div>
        </ng-container>
        <ng-template #loadingOrError>
          <div *ngIf="usersQuery.isLoading(); else errorTemplate">
            Loading users...
          </div>
          <ng-template #errorTemplate>
            <div>Error loading users: {{ usersQuery.error()?.message }}</div>
          </ng-template>
        </ng-template>

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
  `,
})
export class AdminContainer {
  private adminService = inject(AdminService);

  usersQuery = this.adminService.fetchUsers();
  tableModel = new TableModel();

  @ViewChild('overflowTemplate', { static: true })
  overflowTemplate!: TemplateRef<any>;

  menuOptions = [{ id: 'delete', label: 'Delete' }];

  constructor() {
    effect(() => {
      if (this.usersQuery.isSuccess()) {
        const data = this.usersQuery.data();
        if (data) {
          const users = data.pages.flatMap((page) => page.items);
          this.initializeTable(users);
        }
      }
    });
  }

  initializeTable(users: UserProfile[]): void {
    this.tableModel.header = [
      new TableHeaderItem({ data: 'Name' }),
      new TableHeaderItem({ data: 'Email' }),
      new TableHeaderItem({ data: 'Country' }),
      new TableHeaderItem({ data: '', sortable: false }),
    ];
    this.updateTableData(users);
  }

  updateTableData(users: UserProfile[]): void {
    this.tableModel.data = this.prepareData(users);
    this.tableModel.totalDataLength = users.length;
  }

  prepareData(users: UserProfile[]): TableItem[][] {
    return users.map((user) => [
      new TableItem({ data: `${user.firstName} ${user.lastName}` }),
      new TableItem({ data: user.email }),
      new TableItem({ data: user.country }),
      new TableItem({ data: user, template: this.overflowTemplate }),
    ]);
  }

  onTableScroll(event: Event): void {
    const target = event.target as HTMLElement;
    const threshold = target.scrollHeight - target.clientHeight - 500; // 50px before bottom
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
    const user = this.tableModel.data[index][0].data;
    console.log('Row clicked:', user);
  }

  onOverflowMenuSelect(actionId: string, user: UserProfile): void {
    if (actionId === 'delete') {
      this.deleteUser(user.firstName);
    }
  }

  deleteUser(userId: string): void {
    // Implement deletion logic here
    console.log(`Deleting user with ID: ${userId}`);
  }
}
