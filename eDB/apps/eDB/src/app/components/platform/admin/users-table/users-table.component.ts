// src/app/components/platform/admin/admin-user-table/user-table.component.ts

import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import {
  UiLoadingSpinnerComponent,
  UiPlatformOverflowMenuComponent,
  UiTableComponent,
} from '@eDB/shared-ui';
import { TableUtilsService } from '@eDB/shared-utils';
import { TableModel } from 'carbon-components-angular/table';
import { SortParams } from '../../../../models/sort-event.model';
import { UserProfile } from '../../../../models/user.model';
import {
  UserTableColumnConfigs,
  UserTableMapperConfigs,
} from './user-table.config'; // Adjust path as needed

@Component({
  standalone: true,
  selector: 'platform-admin-user-table',
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
  styleUrl: 'users-table.component.scss',
})
export class PlatformAdminUserTableComponent implements OnChanges {
  @Input() users: UserProfile[] = [];
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

  @ViewChild('overflowTemplate', { static: true })
  overflowTemplate!: TemplateRef<any>;

  tableModel = new TableModel();

  constructor(private tableUtils: TableUtilsService) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['users'] && changes['users'].currentValue) {
      this.initializeTable();
    }
  }

  /**
   * Initializes the user management table by setting headers and preparing data.
   */
  initializeTable() {
    // Set up table headers
    this.tableModel.header = this.tableUtils.getTableHeaders(
      UserTableColumnConfigs
    );

    // Prepare table data using TableUtilsService
    this.tableModel.data = this.tableUtils.prepareData(
      this.users,
      UserTableMapperConfigs,
      this.overflowTemplate // Pass the overflow template for action columns
    );
  }

  /**
   * Handles overflow menu selections.
   * @param actionId ID of the selected action.
   * @param user The user associated with the action.
   */
  onOverflowMenuSelect(actionId: string, user: UserProfile): void {
    this.overflowMenuSelect.emit({ actionId, user });
  }
}
