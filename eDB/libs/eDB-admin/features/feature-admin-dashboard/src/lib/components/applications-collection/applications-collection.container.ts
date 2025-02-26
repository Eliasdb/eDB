import { BreakpointObserver } from '@angular/cdk/layout';
import {
  CustomModalService,
  UiButtonComponent,
  UiPlatformOverflowMenuComponent,
  UiTableComponent,
} from '@eDB/shared-ui';

import {
  Component,
  computed,
  effect,
  inject,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';

import { AdminService } from '@eDB/client-admin';
import { TableUtilsService } from '@eDB/shared-utils';
import { PlaceholderModule } from 'carbon-components-angular';
import { TableModel } from 'carbon-components-angular/table';

import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import {
  Application,
  CreateApplicationDto,
} from '../../types/application-overview.model';
import { ApplicationsCollectionAccordionComponent } from '../applications-collection-mobile-accordion/applications-collection-mobile-accordion';
import {
  APPLICATION_TABLE_CONFIG,
  MODAL_CONFIG,
  OVERFLOW_MENU_CONFIG,
} from './applications-collection.container.config';

@Component({
  selector: 'platform-admin-applications-collection',
  imports: [
    UiTableComponent,
    UiButtonComponent,
    PlaceholderModule,
    UiPlatformOverflowMenuComponent,
    CommonModule,
    MatCardModule,
    ApplicationsCollectionAccordionComponent,
  ],
  template: `
    @if (isSmallScreen) {
      <section class="mx-4 mt-8 text-black">
        <h3>Applications</h3>
        <p>Manage applications and their subscribers.</p>
        <ui-button
          size="sm"
          class="mb-4"
          (buttonClick)="openAddApplicationModal()"
          >Add</ui-button
        >
        <platform-applications-accordion
          (deleteApplication)="onMobileDelete($event)"
          (editApplication)="onMobileEdit($event)"
          [items]="applications()"
        />
      </section>
    } @else {
      <ui-table
        title="Applications"
        description="Manage applications and their subscribers."
        [model]="tableModel"
        [showSelectionColumn]="false"
        [showButton]="true"
        (addApplication)="openAddApplicationModal()"
      ></ui-table>
    }

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
export class ApplicationsCollectionContainer implements OnInit {
  private breakpointObserver = inject(BreakpointObserver);
  isSmallScreen = false;

  @ViewChild('actionTemplate', { static: true })
  actionTemplate!: TemplateRef<any>;
  @ViewChild('deleteTemplate', { static: true })
  deleteTemplate!: TemplateRef<any>;

  menuOptions = OVERFLOW_MENU_CONFIG;
  tableModel = new TableModel();

  adminService = inject(AdminService);
  tableUtils = inject(TableUtilsService);
  modalUtils = inject(CustomModalService);
  router = inject(Router);

  private applicationsQuery = this.adminService.queryApplications();
  addApplicationMutation = this.adminService.addApplicationMutation();
  editApplicationMutation = this.adminService.editApplicationMutation();
  deleteApplicationMutation = this.adminService.deleteApplicationMutation();
  revokeSubscriptionMutation = this.adminService.revokeSubscriptionMutation();
  applications = computed(() => this.applicationsQuery.data() || []);

  constructor() {
    effect(() => {
      const applications = this.applications();
      if (applications.length > 0) {
        this.initializeTable(applications);
      } else {
        this.clearTable();
      }
    });
  }
  ngOnInit(): void {
    this.breakpointObserver
      .observe(['(max-width: 768px)'])
      .subscribe((result) => {
        this.isSmallScreen = result.matches;
      });
  }

  // TABLE
  initializeTable(applications: Application[]) {
    this.tableModel.header = APPLICATION_TABLE_CONFIG.headers;
    this.tableModel.data = this.tableUtils.createExpandedData(
      applications,
      APPLICATION_TABLE_CONFIG,
      {
        nonExpandedActionTemplate: this.deleteTemplate,
        expandedActionTemplate: this.actionTemplate,
      },
    );
  }

  clearTable() {
    this.tableModel.data = [];
  }

  onMobileEdit(application: Application): void {
    this.router.navigateByUrl(this.router.url, { replaceUrl: true });
    this.openEditApplicationModal(application);
  }

  onMobileDelete(application: Application): void {
    this.router.navigateByUrl(this.router.url, { replaceUrl: true });
    this.openDeleteConfirmationModal(application);
  }

  onMenuOptionSelected(
    action: string,
    data: { application: Application },
  ): void {
    const { application } = data;
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
      ...MODAL_CONFIG.addApplication,
      onSave: (formData) => this.handleAddApplication(formData),
    });
  }

  openEditApplicationModal(application: Application) {
    console.log(application);
    this.modalUtils.openModal({
      ...MODAL_CONFIG.editApplication(application),
      onSave: (formData) =>
        this.handleEditApplication({ ...application, ...formData }),
    });
  }

  openDeleteConfirmationModal(application: Application) {
    this.modalUtils.openModal({
      ...MODAL_CONFIG.deleteApplication(application.applicationName),
      onSave: () => this.handleDeleteApplication(application.applicationId),
    });
  }

  openRevokeAccessConfirmationModal(userId: number, applicationId: number) {
    this.modalUtils.openModal({
      ...MODAL_CONFIG.revokeAccess(userId, applicationId),
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

  handleEditApplication(newApplication: Application) {
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
      },
    );
  }
}
