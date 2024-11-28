// platform-admin-user-table.component.ts

import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { UiLoadingSpinnerComponent, UiTableComponent } from '@eDB/shared-ui';
import { TableModel } from 'carbon-components-angular';
import { SortParams } from '../../../../models/sort-event.model';
import { UserProfile } from '../../../../models/user.model';

@Component({
  standalone: true,
  selector: 'platform-admin-user-table',
  imports: [CommonModule, UiTableComponent, UiLoadingSpinnerComponent],
  template: `
    <div class="table-container">
      <ui-table
        [title]="'User Management'"
        [description]="'Manage users and their roles.'"
        [model]="tableModel"
        [sortable]="true"
        (rowClicked)="onRowClicked($event)"
        (sortChanged)="onSortChanged($event)"
        [showToolbar]="true"
      ></ui-table>
      <!-- Loading spinner at the bottom -->
      <section *ngIf="loadingMore" class="loading-spinner-container">
        <ui-loading
          [isActive]="loadingMore"
          [size]="'sm'"
          [overlay]="false"
        ></ui-loading>
        <span>Loading</span>
      </section>

      <!-- Optional: No more data message -->
      <div *ngIf="!hasMore && !loading && !loadingMore" class="no-more-data">
        <p>No more users to load.</p>
      </div>
    </div>
  `,
  styleUrls: ['users-table.component.scss'],
})
export class PlatformAdminUserTableComponent {
  @Input() tableModel!: TableModel;
  @Input() loading: boolean = true;
  @Input() loadingMore: boolean = false;
  @Input() hasMore: boolean = true;
  @Input() menuOptions = [{ id: 'delete', label: 'Delete' }];

  @Output() rowClicked = new EventEmitter<number>();
  @Output() sortChanged = new EventEmitter<SortParams>();
  @Output() overflowMenuSelect = new EventEmitter<{
    actionId: string;
    user: UserProfile;
  }>();

  /**
   * Handles row clicks emitted by the UiTableComponent.
   * @param index Index of the clicked row.
   */
  onRowClicked(index: number): void {
    this.rowClicked.emit(index);
  }

  /**
   * Handles sort events emitted by the UiTableComponent.
   * @param sort SortParams.
   */
  onSortChanged(sort: SortParams): void {
    this.sortChanged.emit(sort);
  }
}
