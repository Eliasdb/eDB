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
import {
  UiContentSwitcherComponent,
  UiPlatformOverflowMenuComponent,
} from '@eDB/shared-ui';
import { TableUtilsService } from '@eDB/shared-utils';
import { TableModel } from 'carbon-components-angular';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { PlatformAdminSubscriptionsTableComponent } from '../../../components/platform/admin/subscriptions-table/subscriptions-table.component';
import { PlatformAdminUserTableComponent } from '../../../components/platform/admin/users-table/users-table.component';
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
    UiPlatformOverflowMenuComponent,
  ],
  template: `
    <section class="admin-page" (scroll)="onTableScroll($event)">
      <ui-content-switcher
        [optionsArray]="['Users', 'Subscriptions']"
        [activeSection]="activeSection"
        (activeSectionChange)="onActiveSectionChange($event)"
      >
        <div section1>
          <platform-admin-user-table
            [tableModel]="tableModel"
            [loading]="loading"
            [loadingMore]="loadingMore"
            [hasMore]="hasMore"
            [menuOptions]="menuOptions"
            (rowClicked)="onRowClick($event)"
            (searchChanged)="onSearchChanged($event)"
            (sortChanged)="onSortChanged($event)"
            (overflowMenuSelect)="
              onOverflowMenuSelect($event.actionId, $event.user)
            "
          ></platform-admin-user-table>
          <!-- Overflow Menu Template -->
          <ng-template #overflowTemplate let-user="data">
            <ui-platform-overflow-menu
              [menuOptions]="menuOptions"
              [icon]="'faEllipsisVertical'"
              (menuOptionSelected)="onOverflowMenuSelect($event, user)"
            ></ui-platform-overflow-menu>
          </ng-template>
        </div>

        <div section2>
          <platform-admin-subscriptions-table
            [applications]="applicationsQuery.data()"
            (rowClicked)="onSubscriptionRowClick($event)"
            (revokeSubscription)="onRevokeSubscription($event)"
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
  private destroy$ = new Subject<void>();
  private allUsers: UserProfile[] = []; // Accumulate all users

  tableModel = new TableModel();
  loading = true;
  loadingMore = false;
  hasMore = true;
  activeSection: number = 0; // Track active section: 0 for Users, 1 for Subscriptions

  @ViewChild('overflowTemplate', { static: true })
  overflowTemplate!: TemplateRef<any>;

  @ViewChild('actionTemplate', { static: true })
  actionTemplate!: TemplateRef<any>;
  menuOptions = [{ id: 'delete', label: 'Delete' }];

  // Use injectQuery to get subscriptions
  applicationsQuery = this.adminService.fetchSubscriptions();
  // Use injectMutation for revoking subscriptions
  revokeSubscriptionMutation = this.adminService.revokeSubscription();

  onRevokeSubscription(event: { applicationId: number; userId: number }): void {
    this.revokeSubscriptionMutation.mutate(event, {
      onSuccess: () => {
        console.log('Subscription successfully revoked');
        // Refetch applications after mutation
        this.applicationsQuery.refetch();
      },
      onError: (error) => {
        console.error('Failed to revoke subscription:', error);
      },
    });
  }

  ngOnInit() {
    this.initializeTableHeaders();
    this.adminService.resetSortAndPage({
      sortField: 'id',
      sortDirection: 'asc',
    });
    // this.fetchApplicationsOverview();

    this.adminService
      .fetchPaginatedData$()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (pagedResult: PagedResult<UserProfile>) => {
          if (pagedResult.pageNumber === 1) {
            this.allUsers = []; // Reset for the first page
          }
          this.allUsers = [...this.allUsers, ...pagedResult.items]; // Append new users
          this.updateTableData(this.allUsers); // Update table data
          this.loading = false;
          this.loadingMore = false;
          this.hasMore = pagedResult.hasMore;
        },
        error: (err) => {
          console.error('Error fetching data:', err);
          this.loading = false;
          this.loadingMore = false;
        },
      });
  }

  ngOnDestroy() {
    console.log('AdminContainer destroyed');

    this.destroy$.next();
    this.destroy$.complete();
  }

  initializeTableHeaders(): void {
    this.tableModel.header = this.tableUtils.getTableHeaders(
      AdminTableColumnConfig
    );
  }

  onSearchChanged(search: string): void {
    console.log('Search term received in container:', search);
    this.loading = true; // Show loading indicator
    this.hasMore = true; // Reset hasMore flag
    this.adminService.updateSearchParam(search); // Update search in service
    this.adminService.updatePageParam(1); // Reset to first page
    // No need to manually fetch data; subscription handles it
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
    // No need to manually fetch data; subscription handles it
  }

  onTableScroll(event: Event): void {
    const target = event.target as HTMLElement;
    const threshold = target.scrollHeight - target.clientHeight - 50;
    console.log(this.activeSection);

    if (
      this.activeSection === 0 &&
      target.scrollTop > threshold &&
      this.hasMore &&
      !this.loadingMore
    ) {
      this.loadingMore = true;
      const nextPage = this.adminService.getCurrentPage() + 1;
      this.adminService.updatePageParam(nextPage);
      // No need to manually fetch data; subscription handles it
    }
  }

  onRowClick(index: number): void {
    const user = this.allUsers[index];
  }

  onOverflowMenuSelect(actionId: string, user: UserProfile): void {
    if (actionId === 'delete') {
      this.deleteUser(user.id.toString());
    }
  }

  deleteUser(userId: string): void {
    // Implement deletion logic here, e.g., call adminService.deleteUser(userId)
  }

  /**
   * Handles row clicks in the Subscriptions table.
   * @param index Index of the clicked row.
   */
  onSubscriptionRowClick(index: number) {
    // Perform actions related to the clicked application
  }

  onActiveSectionChange(newSection: number): void {
    this.activeSection = newSection;
    console.log('Active Section updated:', this.activeSection);
  }
}
