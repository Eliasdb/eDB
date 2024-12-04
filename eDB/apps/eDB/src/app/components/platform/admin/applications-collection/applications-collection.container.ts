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
import {
  UiButtonComponent,
  UiModalComponent,
  UiPlatformOverflowMenuComponent,
  UiTableComponent,
} from '@eDB/shared-ui';
import { TableUtilsService } from '@eDB/shared-utils';
import { ModalService, PlaceholderModule } from 'carbon-components-angular';
import { TableModel } from 'carbon-components-angular/table';
import {
  ApplicationOverviewDto,
  CreateApplicationDto,
  RowMapperConfig,
} from '../../../../models/application-overview.model';
import { AdminService } from '../../../../services/admin-service/admin.service';
import {
  getSubscriptionsTableMapperConfigs,
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
  providers: [ModalService],
  template: `
    <ui-table
      [title]="'Applications'"
      [description]="'Manage applications and their subscribers.'"
      [model]="tableModel"
      [showSelectionColumn]="false"
      [sortable]="false"
      [showButton]="true"
      (rowClicked)="onRowClick($event)"
      (addApplication)="openAddApplicationModal()"
    ></ui-table>

    <ng-template #actionTemplate let-data="data">
      <ui-button
        [size]="'sm'"
        [icon]="'faBan'"
        [variant]="'ghost'"
        (click)="onRevokeAccess(data.userId, data.applicationId)"
        >Revoke access</ui-button
      >
    </ng-template>
    <ng-template #deleteTemplate let-data="data">
      <ui-platform-overflow-menu
        [menuOptions]="menuOptions"
        [icon]="'faEllipsisV'"
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

  @Output() rowClicked = new EventEmitter<number>();
  @Output() revokeSubscription = new EventEmitter<{
    userId: number;
    applicationId: number;
  }>();

  tableUtils = inject(TableUtilsService);
  adminService = inject(AdminService);
  modalService = inject(ModalService);

  editApplicationMutation = this.adminService.editApplicationMutation();
  deleteApplicationMutation = this.adminService.deleteApplication();
  addApplicationMutation = this.adminService.addApplicationMutation();

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

  // TABLE SETUP
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
      mapperConfigs,
      this.deleteTemplate
    );
  }

  /**
   * Clears the table data.
   */
  clearTable() {
    this.tableModel.data = [];
  }

  onRevokeAccess(userId: number, applicationId: number) {
    this.revokeSubscription.emit({ userId, applicationId });
  }

  /**
   * Handles row click events to toggle expansion.
   * @param index Index of the clicked row.
   */
  onRowClick(index: number): void {
    // Toggle row expansion
    this.rowClicked.emit(index);
  }

  onMenuOptionSelected(
    action: string,
    application: ApplicationOverviewDto
  ): void {
    if (action === 'edit') {
      this.openEditApplicationModal(application);
    } else if (action === 'delete') {
      this.openDeleteConfirmationModal(application);
    }
  }

  // MODALS

  private openDeleteConfirmationModal(
    application: ApplicationOverviewDto
  ): void {
    const modalRef = this.modalService.create({
      component: UiModalComponent,
    });

    modalRef.instance.header = 'Confirm Deletion';
    modalRef.instance.content = `Are you sure you want to delete the application "${application.applicationName}"? This action cannot be undone.`;
    modalRef.instance.cancelRoute = '/admin';

    modalRef.instance.save.subscribe(() => {
      this.onDeleteApplication(application.applicationId);
      modalRef.destroy();
    });

    modalRef.instance.close.subscribe(() => {
      modalRef.destroy();
    });
  }

  openAddApplicationModal() {
    const modalRef = this.modalService.create<UiModalComponent>({
      component: UiModalComponent,
    });

    modalRef.instance.header = 'Add Application';
    modalRef.instance.hasForm = true;

    modalRef.instance.save.subscribe((formData: any) => {
      this.handleAddApplication(formData);
      modalRef.destroy();
    });

    modalRef.instance.close.subscribe(() => {
      modalRef.destroy();
    });
  }

  openEditApplicationModal(application: ApplicationOverviewDto) {
    const modalRef = this.modalService.create<UiModalComponent>({
      component: UiModalComponent,
    });

    modalRef.instance.header = 'Edit Application';
    modalRef.instance.hasForm = true;
    modalRef.instance.cancelRoute = '/admin';

    // Prefill the form with current application data
    modalRef.instance.form.patchValue({
      name: application.applicationName,
      description: application.applicationDescription,
      iconUrl: application.applicationIconUrl,
      routePath: application.applicationRoutePath,
      tags: application.applicationTags?.join(', '), // Convert array to a comma-separated string
    });

    modalRef.instance.save.subscribe((formData: any) => {
      this.handleEditApplication({ ...application, ...formData });
      modalRef.destroy();
    });

    modalRef.instance.close.subscribe(() => {
      modalRef.destroy();
    });
  }

  onDeleteApplication(applicationId: number) {
    this.deleteApplicationMutation.mutate(applicationId, {
      onSuccess: () => {
        console.log('Application deleted successfully');
      },
      onError: (error) => {
        console.error('Failed to add application:', error);
      },
    });
  }

  handleAddApplication(newApplication: CreateApplicationDto): void {
    this.addApplicationMutation.mutate(newApplication, {
      onSuccess: () => {
        console.log('Application added successfully');
      },
      onError: (error) => {
        console.error('Failed to add application:', error);
      },
    });
  }

  handleEditApplication(newApplication: ApplicationOverviewDto): void {
    this.editApplicationMutation.mutate(newApplication, {
      onSuccess: () => {
        console.log('Application edited successfully');
      },
      onError: (error) => {
        console.error('Failed to add application:', error);
      },
    });
  }
}
