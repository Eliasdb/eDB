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

  tableUtils = inject(TableUtilsService);
  adminService = inject(AdminService);
  modalService = inject(ModalService);
  router = inject(Router);

  editApplicationMutation = this.adminService.editApplicationMutation();
  deleteApplicationMutation = this.adminService.deleteApplicationMutation();
  addApplicationMutation = this.adminService.addApplicationMutation();
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
  /**
   * Initializes the table by setting headers and preparing data.
   */
  initializeTable(applications: ApplicationOverviewDto[]) {
    // Set up table headers
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
    console.log('row clicked');
  }

  onMenuOptionSelected(
    action: string,
    application: ApplicationOverviewDto
  ): void {
    if (action === 'edit') {
      this.router.navigateByUrl(this.router.url, { replaceUrl: true });
      this.openEditApplicationModal(application);
    } else if (action === 'delete') {
      this.router.navigateByUrl(this.router.url, { replaceUrl: true });
      this.openDeleteConfirmationModal(application);
    }
  }

  onRevokeAccess(userId: number, applicationId: number): void {
    this.openRevokeAccessConfirmationModal(userId, applicationId);
  }

  // MODALS

  protected openAddApplicationModal() {
    const modalRef = this.modalService.create<UiModalComponent>({
      component: UiModalComponent,
    });

    modalRef.instance.header = 'Add Application';
    modalRef.instance.hasForm = true;

    modalRef.instance.save.subscribe((formData: any) => {
      this.onAddApplication(formData);
      modalRef.destroy();
    });

    modalRef.instance.close.subscribe(() => {
      modalRef.destroy();
    });
  }

  private openRevokeAccessConfirmationModal(
    userId: number,
    applicationId: number
  ): void {
    const modalRef = this.modalService.create<UiModalComponent>({
      component: UiModalComponent,
    });

    modalRef.instance.header = 'Confirm Revocation';
    modalRef.instance.content = `Are you sure you want to revoke access for User ID: ${userId} from Application ID: ${applicationId}? This action cannot be undone.`;

    modalRef.instance.save.subscribe(() => {
      this.onRevokeSubscription(userId, applicationId);
      modalRef.destroy();
    });

    modalRef.instance.close.subscribe(() => {
      modalRef.destroy();
    });
  }

  private openDeleteConfirmationModal(
    application: ApplicationOverviewDto
  ): void {
    const modalRef = this.modalService.create({
      component: UiModalComponent,
    });

    modalRef.instance.header = 'Confirm Deletion';
    modalRef.instance.content = `Are you sure you want to delete the application "${application.applicationName}"? This action cannot be undone.`;

    modalRef.instance.save.subscribe(() => {
      this.onDeleteApplication(application.applicationId);
      modalRef.destroy();
    });

    modalRef.instance.close.subscribe(() => {
      modalRef.destroy();
    });
  }

  private openEditApplicationModal(application: ApplicationOverviewDto) {
    const modalRef = this.modalService.create<UiModalComponent>({
      component: UiModalComponent,
    });

    modalRef.instance.header = 'Edit Application';
    modalRef.instance.hasForm = true;

    // Prefill the form with current application data
    modalRef.instance.form.patchValue({
      name: application.applicationName,
      description: application.applicationDescription,
      iconUrl: application.applicationIconUrl,
      routePath: application.applicationRoutePath,
      tags: application.applicationTags?.join(', '), // Convert array to a comma-separated string
    });

    modalRef.instance.save.subscribe((formData: any) => {
      this.onEditApplication({ ...application, ...formData });
      modalRef.destroy();
    });

    modalRef.instance.close.subscribe(() => {
      modalRef.destroy();
    });
  }

  // MUTATIONS

  private onDeleteApplication(applicationId: number) {
    this.deleteApplicationMutation.mutate(applicationId, {
      onSuccess: () => {
        console.log('Application deleted successfully');
      },
      onError: (error) => {
        console.error('Failed to add application:', error);
      },
    });
  }

  private onAddApplication(newApplication: CreateApplicationDto): void {
    this.addApplicationMutation.mutate(newApplication, {
      onSuccess: () => {
        console.log('Application added successfully');
      },
      onError: (error) => {
        console.error('Failed to add application:', error);
      },
    });
  }

  private onEditApplication(newApplication: ApplicationOverviewDto): void {
    this.editApplicationMutation.mutate(newApplication, {
      onSuccess: () => {
        console.log('Application edited successfully');
      },
      onError: (error) => {
        console.error('Failed to add application:', error);
      },
    });
  }

  private onRevokeSubscription(userId: number, applicationId: number): void {
    this.revokeSubscriptionMutation.mutate(
      { userId, applicationId },
      {
        onSuccess: () => {
          console.log('Access successfully revoked');
        },
        onError: (error) => {
          console.error('Failed to revoke access:', error);
        },
      }
    );
  }
}
