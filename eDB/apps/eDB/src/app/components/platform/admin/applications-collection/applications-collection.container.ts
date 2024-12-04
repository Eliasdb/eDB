// src/app/components/platform/admin/subscriptions-table/subscriptions-table.component.ts

import { CommonModule } from '@angular/common';
import {
  Component,
  inject,
  Input,
  OnChanges,
  SimpleChanges,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import {
  UiButtonComponent,
  UiPlatformOverflowMenuComponent,
  UiTableComponent,
} from '@eDB/shared-ui';
import { ModalUtilsService, TableUtilsService } from '@eDB/shared-utils';
import { PlaceholderModule } from 'carbon-components-angular';
import { TableModel } from 'carbon-components-angular/table';
import {
  ApplicationOverviewDto,
  CreateApplicationDto,
  RowMapperConfig,
} from '../../../../models/application-overview.model';
import { AdminService } from '../../../../services/admin-service/admin.service';
import {
  getSubscriptionsTableMapperConfigs,
  modalConfigs,
  SubscriptionsTableColumnConfigs,
} from './applications-collection.container.config';

@Component({
  standalone: true,
  selector: 'platform-admin-applications-collection',
  imports: [
    CommonModule,
    UiTableComponent,
    UiButtonComponent,
    PlaceholderModule,
    UiPlatformOverflowMenuComponent,
  ],
  template: `
    <ui-table
      title="Applications"
      description="Manage applications and their subscribers."
      [model]="tableModel"
      [showSelectionColumn]="false"
      [showButton]="true"
      (addApplication)="openAddApplicationModal()"
    ></ui-table>

    <ng-template #actionTemplate let-data="data">
      <ui-button
        size="sm"
        icon="faBan"
        variant="ghost"
        (click)="onRevokeAccess(data.userId, data.applicationId)"
        >Revoke access</ui-button
      >
    </ng-template>
    <ng-template #deleteTemplate let-data="data">
      <ui-platform-overflow-menu
        icon="faEllipsisV"
        [menuOptions]="menuOptions"
        (menuOptionSelected)="onMenuOptionSelected($event, data)"
      ></ui-platform-overflow-menu>
    </ng-template>
  `,
})
export class ApplicationsCollectionContainer implements OnChanges {
  @Input() applications: ApplicationOverviewDto[] | undefined;

  @ViewChild('actionTemplate', { static: true })
  actionTemplate!: TemplateRef<any>;
  @ViewChild('deleteTemplate', { static: true })
  deleteTemplate!: TemplateRef<any>;

  tableModel = new TableModel();

  menuOptions = [
    { id: 'edit', label: 'Edit Application' },
    { id: 'delete', label: 'Delete Application' },
  ];

  adminService = inject(AdminService);
  tableUtils = inject(TableUtilsService);
  modalUtils = inject(ModalUtilsService);
  router = inject(Router);

  addApplicationMutation = this.adminService.addApplicationMutation();
  editApplicationMutation = this.adminService.editApplicationMutation();
  deleteApplicationMutation = this.adminService.deleteApplicationMutation();
  revokeSubscriptionMutation = this.adminService.revokeSubscriptionMutation();

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

  // TABLE

  initializeTable(applications: ApplicationOverviewDto[]) {
    this.tableModel.header = this.tableUtils.getTableHeaders(
      SubscriptionsTableColumnConfigs
    );

    const mapperConfigs: RowMapperConfig<ApplicationOverviewDto>[] =
      getSubscriptionsTableMapperConfigs((app) =>
        this.tableUtils.createSubscriptionsExpandedData(
          app,
          this.actionTemplate
        )
      );

    this.tableModel.data = this.tableUtils.prepareData(
      applications,
      mapperConfigs,
      this.deleteTemplate
    );
  }

  clearTable() {
    this.tableModel.data = [];
  }

  onMenuOptionSelected(
    action: string,
    application: ApplicationOverviewDto
  ): void {
    this.router.navigateByUrl(this.router.url, { replaceUrl: true });
    if (action === 'edit') {
      this.openEditApplicationModal(application);
    } else if (action === 'delete') {
      this.openDeleteConfirmationModal(application);
    }
  }

  onRevokeAccess(userId: number, applicationId: number): void {
    this.openRevokeAccessConfirmationModal(userId, applicationId);
  }

  // MODALS

  openAddApplicationModal() {
    this.modalUtils.openModal({
      ...modalConfigs.addApplication,
      onSave: (formData) => this.handleAddApplication(formData),
    });
  }

  openEditApplicationModal(application: ApplicationOverviewDto) {
    this.modalUtils.openModal({
      ...modalConfigs.editApplication(application),
      onSave: (formData) =>
        this.handleEditApplication({ ...application, ...formData }),
    });
  }

  openDeleteConfirmationModal(application: ApplicationOverviewDto) {
    this.modalUtils.openModal({
      ...modalConfigs.deleteApplication(application.applicationName),
      onSave: () => this.handleDeleteApplication(application.applicationId),
    });
  }

  openRevokeAccessConfirmationModal(userId: number, applicationId: number) {
    this.modalUtils.openModal({
      ...modalConfigs.revokeAccess(userId, applicationId),
      onSave: () => this.handleRevokeAccess(userId, applicationId),
    });
  }

  // MUTATIONS

  handleAddApplication(newApplication: CreateApplicationDto) {
    this.addApplicationMutation.mutate(newApplication, {
      onSuccess: () => console.log('Application added successfully'),
      onError: (err) => console.error('Failed to add application', err),
    });
  }

  handleDeleteApplication(applicationId: number) {
    this.deleteApplicationMutation.mutate(applicationId, {
      onSuccess: () => console.log('Application deleted successfully'),
      onError: (err) => console.error('Failed to delete application', err),
    });
  }

  handleEditApplication(newApplication: ApplicationOverviewDto) {
    this.editApplicationMutation.mutate(newApplication, {
      onSuccess: () => console.log('Application edited successfully'),
      onError: (err) => console.error('Failed to edit application', err),
    });
  }

  handleRevokeAccess(userId: number, applicationId: number) {
    this.revokeSubscriptionMutation.mutate(
      { userId, applicationId },
      {
        onSuccess: () => console.log('Access successfully revoked'),
        onError: (err) => console.error('Failed to revoke access', err),
      }
    );
  }
}
