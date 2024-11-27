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
import { TableUtilsService } from '@eDB/shared-utils';
import { TableModel } from 'carbon-components-angular';
import { Subscription } from 'rxjs';
import { tap } from 'rxjs/operators';
import { PlatformAdminUserTableComponent } from '../../../components/platform/admin/admin-user-table/user-table.component';
import { PlatformAdminSubscriptionsTableComponent } from '../../../components/platform/admin/subscriptions-table/subscriptions-table.component';
import { ApplicationOverviewDto } from '../../../models/application-overview.model';
import { PagedResult } from '../../../models/paged-result.model'; // Ensure correct path
import { SortParams } from '../../../models/sort-event.model';
import { UserProfile } from '../../../models/user.model';
import { AdminService } from '../../../services/admin-service/admin.service';
import {
  AdminTableColumnConfig,
  mapUsersToTableData,
} from './admin.container.config'; // Adjust the path if needed

@Component({
  standalone: true,
  selector: 'platform-admin',
  imports: [
    CommonModule,
    UiContentSwitcherComponent,
    PlatformAdminUserTableComponent,
    PlatformAdminSubscriptionsTableComponent,
  ],
  template: `
    <section class="admin-page" (scroll)="onTableScroll($event)">
      <ui-content-switcher [optionsArray]="['Users', 'Subscriptions']">
        <div section1>
          <platform-admin-user-table
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
          ></platform-admin-user-table>
        </div>

        <div section2>
          <platform-admin-subscriptions-table
            [applications]="applications"
            (rowClicked)="onSubscriptionRowClick($event)"
          ></platform-admin-subscriptions-table>
        </div>
      </ui-content-switcher>
    </section>
  `,
  styleUrls: ['admin.container.scss'], // Corrected from 'styleUrl' to 'styleUrls'
})
export class AdminContainer implements OnInit, OnDestroy {
  private adminService = inject(AdminService);
  private tableUtils = inject(TableUtilsService);
  private dataSubscription!: Subscription;
  private allUsers: UserProfile[] = []; // Accumulate all users

  tableModel = new TableModel();
  loading = true;
  loadingMore = false;
  hasMore = true;

  @ViewChild('overflowTemplate', { static: true })
  overflowTemplate!: TemplateRef<any>;
  menuOptions = [{ id: 'delete', label: 'Delete' }];

  applications: ApplicationOverviewDto[] = [];
  private subscriptionsDataSubscription!: Subscription;

  constructor() {
    this.tableModel.data = [];
  }

  ngOnInit() {
    this.initializeTableHeaders();
    this.adminService.resetSortAndPage({
      sortField: 'id',
      sortDirection: 'asc',
    });

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
    this.fetchApplicationsOverview();
  }

  ngOnDestroy() {
    this.dataSubscription.unsubscribe();
  }

  initializeTableHeaders(): void {
    this.tableModel.header = this.tableUtils.getTableHeaders(
      AdminTableColumnConfig
    );
  }

  updateTableData(users: UserProfile[]): void {
    this.tableModel.data = mapUsersToTableData(users, this.overflowTemplate);
    this.tableModel.totalDataLength = this.tableModel.data.length;
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

  // Fetch applications overview data
  fetchApplicationsOverview() {
    this.subscriptionsDataSubscription = this.adminService
      .fetchApplicationsOverview$()
      .subscribe({
        next: (applications) => {
          this.applications = applications;
        },
        error: (err) => {
          console.error('Error fetching applications overview:', err);
        },
      });
  }

  // Handle row click in subscriptions table
  onSubscriptionRowClick(index: number) {
    console.log('Application row clicked:', index);
  }
}
