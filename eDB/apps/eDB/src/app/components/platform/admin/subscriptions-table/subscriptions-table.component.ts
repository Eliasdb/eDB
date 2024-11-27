// src/app/components/platform/admin/admin-subscriptions-table/subscriptions-table.component.ts

import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { UiTableComponent } from '@eDB/shared-ui';
import {
  TableHeaderItem,
  TableItem,
  TableModel,
} from 'carbon-components-angular/table';
import {
  ApplicationOverviewDto,
  SubscribedUserDto,
} from '../../../../models/application-overview.model';

@Component({
  standalone: true,
  selector: 'platform-admin-subscriptions-table',
  imports: [CommonModule, UiTableComponent],
  template: `
    <ui-table
      [title]="'Applications'"
      [description]="'Manage applications and their subscribers.'"
      [model]="tableModel"
      [showSelectionColumn]="false"
      [sortable]="false"
      (rowClicked)="onRowClick($event)"
    ></ui-table>
  `,
})
export class PlatformAdminSubscriptionsTableComponent implements OnChanges {
  @Input() applications: ApplicationOverviewDto[] = [];
  @Output() rowClicked = new EventEmitter<number>();

  tableModel = new TableModel();

  ngOnChanges(changes: SimpleChanges) {
    if (changes['applications'] && changes['applications'].currentValue) {
      this.initializeTable();
    }
  }

  initializeTable() {
    // Set up table headers
    this.tableModel.header = [
      new TableHeaderItem({ data: 'Application Name' }),
      new TableHeaderItem({ data: 'Description' }),
      new TableHeaderItem({ data: 'Subscribers' }),
    ];

    // Set up table data with expandable rows
    this.tableModel.data = this.applications.map((app) => [
      new TableItem({
        data: app.applicationName,
        expandedData: this.createExpandedData(app.subscribedUsers),
        expandAsTable: true,
      }),
      new TableItem({ data: app.applicationDescription }),
      new TableItem({ data: app.subscribedUsers.length }),
    ]);
  }

  // Create expanded data as TableItem[][]
  createExpandedData(subscribedUsers: SubscribedUserDto[]): TableItem[][] {
    // Define headers for the expanded table

    // Map subscribed users to TableItem[] rows
    const data = subscribedUsers.map((user) => [
      new TableItem({ data: user.userName }),
      new TableItem({ data: user.userEmail }),
      new TableItem({
        data: new Date(user.subscriptionDate).toLocaleDateString('en-US', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        }),
      }),
    ]);

    // Return as TableItem[][] with header
    return data;
  }

  onRowClick(index: number): void {
    // Toggle row expansion
    this.rowClicked.emit(index);
  }
}
