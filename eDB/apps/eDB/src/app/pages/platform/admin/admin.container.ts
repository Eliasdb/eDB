// src/app/components/platform/admin/admin.container.ts

import { CommonModule } from '@angular/common';
import {
  Component,
  inject,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { UiContentSwitcherComponent } from '@eDB/shared-ui';
import {
  TableHeaderItem,
  TableItem,
  TableModel,
} from 'carbon-components-angular';
import { Subscription } from 'rxjs';
import { tap } from 'rxjs/operators';
import { PlatformAdminUserManagementComponent } from '../../../components/platform/admin-user-management/admin-user-management';
import { PagedResult } from '../../../models/paged-result.model'; // Ensure correct path
import { SortParams } from '../../../models/sort-event.model';
import { UserProfile } from '../../../models/user.model';
import { AdminService } from '../../../services/admin-service/admin.service';

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

        <div section2>
          <h2>Subscriptions</h2>
          <p>Manage your subscriptions here.</p>
        </div>
      </ui-content-switcher>
    </section>
  `,
  styleUrls: ['admin.container.scss'], // Corrected from 'styleUrl' to 'styleUrls'
})
export class AdminContainer implements OnInit, OnDestroy {
  private adminService = inject(AdminService);
  private dataSubscription!: Subscription;

  tableModel = new TableModel();
  loading = true;
  loadingMore = false;
  hasMore = true;

  private allUsers: UserProfile[] = []; // Accumulate all users

  @ViewChild('overflowTemplate', { static: true })
  overflowTemplate!: TemplateRef<any>;
  menuOptions = [{ id: 'delete', label: 'Delete' }];

  constructor() {
    this.tableModel.data = [];
  }

  ngOnInit() {
    this.initializeTableHeaders();

    this.dataSubscription = this.adminService
      .fetchPaginatedData$()
      .pipe(
        tap((pagedResult: PagedResult<UserProfile>) => {
          if (pagedResult.pageNumber === 1) {
            this.allUsers = []; // Reset for the first page
          }
          this.allUsers = [...this.allUsers, ...pagedResult.items]; // Append new users
          this.updateTableData(this.allUsers); // Update table data
          this.loading = false;
          this.loadingMore = false;
          this.hasMore = pagedResult.hasMore;
        })
      )
      .subscribe({
        error: (err) => {
          console.error('Error fetching data:', err);
          this.loading = false;
          this.loadingMore = false;
        },
      });
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
      new TableHeaderItem({ data: '', sortable: false }),
    ];
  }

  updateTableData(users: UserProfile[]): void {
    this.tableModel.data = this.prepareData(users);
    this.tableModel.totalDataLength = this.tableModel.data.length;
  }

  prepareData(users: UserProfile[]): TableItem[][] {
    return users.map((user) => [
      new TableItem({ data: user.id }),
      new TableItem({ data: `${user.firstName} ${user.lastName}` }),
      new TableItem({ data: user.email }),
      new TableItem({ data: user.role }),
      new TableItem({ data: user.state }),
      new TableItem({ data: user, template: this.overflowTemplate }),
    ]);
  }

  onSortChanged(sort: SortParams): void {
    this.loading = true; // Show loading indicator
    this.hasMore = true; // Reset hasMore
    this.adminService.updateSortParams(sort);
    this.adminService.updatePageParam(1); // Reset to first page
  }

  onTableScroll(event: Event): void {
    const target = event.target as HTMLElement;
    const threshold = target.scrollHeight - target.clientHeight - 50;

    if (target.scrollTop > threshold && this.hasMore && !this.loadingMore) {
      this.loadingMore = true;
      const nextPage = this.adminService.getCurrentPage() + 1;
      this.adminService.updatePageParam(nextPage);
    }
  }

  onRowClick(index: number): void {
    const user = this.tableModel.data[index][5].data as UserProfile;
    console.log('Row clicked:', user);
    // Navigate to user detail or perform other actions
  }

  onOverflowMenuSelect(actionId: string, user: UserProfile): void {
    if (actionId === 'delete') {
      this.deleteUser(user.id.toString());
    }
  }

  deleteUser(userId: string): void {
    console.log(`Deleting user with ID: ${userId}`);
    // Implement deletion logic here, e.g., call adminService.deleteUser(userId)
  }
}
