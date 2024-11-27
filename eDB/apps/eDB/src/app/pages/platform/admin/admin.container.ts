// src/app/components/platform/admin/admin.container.ts

import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { UiContentSwitcherComponent } from '@eDB/shared-ui';
import { Subscription } from 'rxjs';
import { tap } from 'rxjs/operators';
import { PlatformAdminSubscriptionsTableComponent } from '../../../components/platform/admin/subscriptions-table/subscriptions-table.component';
import { PlatformAdminUserTableComponent } from '../../../components/platform/admin/users-table/users-table.component';
import { ApplicationOverviewDto } from '../../../models/application-overview.model';
import { PagedResult } from '../../../models/paged-result.model';
import { SortParams } from '../../../models/sort-event.model';
import { UserProfile } from '../../../models/user.model';
import { AdminService } from '../../../services/admin-service/admin.service';

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
            [users]="allUsers"
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
  private dataSubscription!: Subscription;
  private subscriptionsDataSubscription!: Subscription;
  protected allUsers: UserProfile[] = []; // Accumulate all users

  loading = true;
  loadingMore = false;
  hasMore = true;

  menuOptions = [{ id: 'delete', label: 'Delete' }];

  applications: ApplicationOverviewDto[] = [];

  constructor() {}

  ngOnInit() {
    // Initialize sorting and pagination
    this.adminService.resetSortAndPage({
      sortField: 'id',
      sortDirection: 'asc',
    });

    // Fetch users data
    this.dataSubscription = this.adminService
      .fetchPaginatedData$()
      .pipe(
        tap((pagedResult: PagedResult<UserProfile>) => {
          if (pagedResult.pageNumber === 1) {
            this.allUsers = []; // Reset for the first page
          }
          this.allUsers = [...this.allUsers, ...pagedResult.items]; // Append new users
          this.loading = false;
          this.loadingMore = false;
          this.hasMore = pagedResult.hasMore;
        })
      )
      .subscribe({
        error: (err) => {
          console.error('Error fetching users:', err);
          this.loading = false;
          this.loadingMore = false;
        },
      });

    // Fetch applications overview data
    this.fetchApplicationsOverview();
  }

  ngOnDestroy() {
    if (this.dataSubscription) {
      this.dataSubscription.unsubscribe();
    }
    if (this.subscriptionsDataSubscription) {
      this.subscriptionsDataSubscription.unsubscribe();
    }
  }

  /**
   * Handles sort changes from the User Management table.
   * @param sort SortParams.
   */
  onSortChanged(sort: SortParams): void {
    this.loading = true; // Show loading indicator
    this.hasMore = true; // Reset hasMore
    this.adminService.updateSortParams(sort);
    this.adminService.updatePageParam(1); // Reset to first page
  }

  /**
   * Handles infinite scrolling to load more users.
   * @param event Scroll event.
   */
  onTableScroll(event: Event): void {
    const target = event.target as HTMLElement;
    const threshold = target.scrollHeight - target.clientHeight - 50;

    if (target.scrollTop > threshold && this.hasMore && !this.loadingMore) {
      this.loadingMore = true;
      const nextPage = this.adminService.getCurrentPage() + 1;
      this.adminService.updatePageParam(nextPage);
    }
  }

  /**
   * Handles row clicks in the User Management table.
   * @param index Index of the clicked row.
   */
  onRowClick(index: number): void {
    const user = this.allUsers[index];
    console.log('Row clicked:', user);
    // Navigate to user detail or perform other actions
  }

  /**
   * Handles overflow menu selections from the User Management table.
   * @param actionId ID of the selected action.
   * @param user The user associated with the action.
   */
  onOverflowMenuSelect(actionId: string, user: UserProfile): void {
    if (actionId === 'delete') {
      this.deleteUser(user.id.toString());
    }
  }

  /**
   * Deletes a user by ID.
   * @param userId ID of the user to delete.
   */
  deleteUser(userId: string): void {
    console.log(`Deleting user with ID: ${userId}`);
    // Implement deletion logic here, e.g., call adminService.deleteUser(userId)
  }

  /**
   * Fetches applications overview data.
   */
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

  /**
   * Handles row clicks in the Subscriptions table.
   * @param index Index of the clicked row.
   */
  onSubscriptionRowClick(index: number) {
    console.log('Application row clicked:', index);
    // Perform actions related to the clicked application
  }
}
