// src/app/components/platform/admin/subscriptions-table/subscriptions-table.component.ts

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
import { TableUtilsService } from '@eDB/shared-utils';
import { TableModel } from 'carbon-components-angular/table';
import {
  ApplicationOverviewDto,
  RowMapperConfig,
} from '../../../../models/application-overview.model';
import {
  SubscriptionsTableColumnConfigs,
  getSubscriptionsTableMapperConfigs,
} from './subscriptions-table.config'; // Adjust path as needed

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

  constructor(private tableUtils: TableUtilsService) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['applications'] && changes['applications'].currentValue) {
      this.initializeTable();
    }
  }

  /**
   * Initializes the table by setting headers and preparing data.
   */
  initializeTable() {
    // Set up table headers
    this.tableModel.header = this.tableUtils.getTableHeaders(
      SubscriptionsTableColumnConfigs
    );

    // Prepare mapperConfigs with expanded data handler from the service
    const mapperConfigs: RowMapperConfig<ApplicationOverviewDto>[] =
      getSubscriptionsTableMapperConfigs(
        this.tableUtils.createSubscriptionsExpandedData
      );

    // Prepare table data using TableUtilsService
    this.tableModel.data = this.tableUtils.prepareData(
      this.applications,
      mapperConfigs,
      undefined // No overflow template needed for subscriptions table
    );
  }

  /**
   * Handles row click events to toggle expansion.
   * @param index Index of the clicked row.
   */
  onRowClick(index: number): void {
    // Toggle row expansion
    this.rowClicked.emit(index);
  }
}
