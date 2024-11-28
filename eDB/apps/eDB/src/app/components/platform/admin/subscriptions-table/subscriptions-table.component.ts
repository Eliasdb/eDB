// src/app/components/platform/admin/subscriptions-table/subscriptions-table.component.ts

import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { UiTableComponent } from '@eDB/shared-ui';
import { TableUtilsService } from '@eDB/shared-utils';
import { TableModel } from 'carbon-components-angular/table';
import { UiButtonComponent } from '../../../../../../../../libs/ui/src/lib/components/buttons/button/button.component';
import {
  ApplicationOverviewDto,
  CreateApplicationDto,
  RowMapperConfig,
} from '../../../../models/application-overview.model';
import { AdminService } from '../../../../services/admin-service/admin.service';
import {
  getSubscriptionsTableMapperConfigs,
  SubscriptionsTableColumnConfigs,
} from './subscriptions-table.config';

@Component({
  standalone: true,
  selector: 'platform-admin-subscriptions-table',
  imports: [CommonModule, UiTableComponent, UiButtonComponent],
  template: `
    <ui-table
      [title]="'Applications'"
      [description]="'Manage applications and their subscribers.'"
      [model]="tableModel"
      [showSelectionColumn]="false"
      [sortable]="false"
      (rowClicked)="onRowClick($event)"
      (addApplication)="handleAddApplication()"
      [showButton]="true"
    ></ui-table>
    <ng-template #actionTemplate let-data="data">
      <ui-button
        (click)="onRevokeAccess(data.userId, data.applicationId)"
        [size]="'sm'"
        [icon]="'faBan'"
        [variant]="'danger'"
        >Revoke access</ui-button
      >
    </ng-template>
  `,
})
export class PlatformAdminSubscriptionsTableComponent implements OnChanges {
  handleClick() {
    console.log('yoo');
  }
  @Input() applications: ApplicationOverviewDto[] | undefined;
  @Output() rowClicked = new EventEmitter<number>();
  @Output() revokeSubscription = new EventEmitter<{
    userId: number;
    applicationId: number;
  }>();

  @ViewChild('actionTemplate', { static: true })
  actionTemplate!: TemplateRef<any>;

  tableModel = new TableModel();

  tableUtils = inject(TableUtilsService);
  adminService = inject(AdminService);

  ngOnChanges(changes: SimpleChanges) {
    if (changes['applications']) {
      const apps = changes['applications'].currentValue;
      if (apps) {
        this.initializeTable(apps);
      } else {
        this.clearTable();
      }
    }
  }

  addApplicationMutation = this.adminService.addApplicationMutation();

  handleAddApplication(): void {
    // Replace with a proper form/dialog for collecting application data
    const newApplication: CreateApplicationDto = {
      name: 'Task Management Tool',
      description: 'A tool to manage tasks and projects effectively.',
      iconUrl: 'https://example.com/icons/task-management.png',
      routePath: '/task-manager',
    };

    this.addApplicationMutation.mutate(newApplication, {
      onSuccess: () => {
        console.log('Application added successfully');
      },
      onError: (error) => {
        console.error('Failed to add application:', error);
      },
    });
  }

  onRevokeAccess(userId: number, applicationId: number) {
    this.revokeSubscription.emit({ userId, applicationId });
  }

  /**
   * Initializes the table by setting headers and preparing data.
   */
  initializeTable(applications: ApplicationOverviewDto[]) {
    // Set up table headers
    this.tableModel.header = this.tableUtils.getTableHeaders(
      SubscriptionsTableColumnConfigs
    );

    const revokeCallback = (userId: number, applicationId: number) => {
      this.revokeSubscription.emit({ userId, applicationId });
    };

    const mapperConfigs: RowMapperConfig<ApplicationOverviewDto>[] =
      getSubscriptionsTableMapperConfigs((app) =>
        this.tableUtils.createSubscriptionsExpandedData(
          app,
          revokeCallback,
          this.actionTemplate
        )
      );

    this.tableModel.data = this.tableUtils.prepareData(
      applications,
      mapperConfigs
    );
  }

  /**
   * Clears the table data.
   */
  clearTable() {
    this.tableModel.data = [];
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
