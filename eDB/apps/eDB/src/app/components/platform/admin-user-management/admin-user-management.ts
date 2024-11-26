import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  Output,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import {
  UiLoadingSpinnerComponent,
  UiPlatformOverflowMenuComponent,
  UiTableComponent,
} from '@eDB/shared-ui';
import { TableModel } from 'carbon-components-angular';
import { SortEvent } from '../../../models/sort-event.model';
import { UserProfile } from '../../../models/user.model';

@Component({
  standalone: true,
  selector: 'platform-admin-user-management',
  imports: [
    CommonModule,
    UiTableComponent,
    UiPlatformOverflowMenuComponent,
    UiLoadingSpinnerComponent,
  ],
  template: `
    <div class="table-container">
      <ui-table
        [title]="'User Management'"
        [description]="'Manage users and their roles.'"
        [model]="tableModel"
        [sortable]="true"
        [showPagination]="false"
        [skeleton]="loading"
        (rowClicked)="rowClicked.emit($event)"
        (sortChanged)="sortChanged.emit($event)"
      ></ui-table>
      <!-- Loading spinner at the bottom -->
      <ui-loading
        [isActive]="loadingMore"
        [size]="'sm'"
        [overlay]="false"
      ></ui-loading>

      <!-- Overflow Menu Template -->
      <ng-template #overflowTemplate let-user="data">
        <ui-platform-overflow-menu
          [menuOptions]="menuOptions"
          [icon]="'faEllipsisVertical'"
          (menuOptionSelected)="onOverflowMenuSelect($event, user)"
        ></ui-platform-overflow-menu>
      </ng-template>

      <!-- Optional: No more data message -->
      <div *ngIf="!hasMore && !loading && !loadingMore" class="no-more-data">
        No more users to load.
      </div>
    </div>
  `,
  styles: [
    `
      .table-container {
        position: relative;
        min-height: 200px; /* Optional: Ensures a minimum height for centering */
      }

      .no-more-data {
        text-align: center;
        padding: 1rem;
        color: #666;
      }
    `,
  ],
})
export class PlatformAdminUserManagementComponent {
  @Input() tableModel!: TableModel;
  @Input() loading: boolean = true;
  @Input() loadingMore: boolean = false;
  @Input() hasMore: boolean = true;
  @Input() menuOptions = [{ id: 'delete', label: 'Delete' }];
  @Output() rowClicked = new EventEmitter<number>();
  @Output() sortChanged = new EventEmitter<SortEvent>();
  @Output() overflowMenuSelect = new EventEmitter<{
    actionId: string;
    user: UserProfile;
  }>();

  @ViewChild('overflowTemplate', { static: true })
  overflowTemplate!: TemplateRef<any>;

  onOverflowMenuSelect(actionId: string, user: UserProfile): void {
    this.overflowMenuSelect.emit({ actionId, user });
  }
}
