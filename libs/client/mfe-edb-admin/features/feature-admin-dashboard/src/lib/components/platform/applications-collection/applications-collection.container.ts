import { BreakpointObserver } from '@angular/cdk/layout';
import {
  CustomModalService,
  UiButtonComponent,
  UiPlatformOverflowMenuComponent,
  UiTableComponent,
  UiTextInputComponent,
} from '@edb/shared-ui';

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
import { TableUtilsService } from '@edb/util-common';
import { PlaceholderModule, ModalModule } from 'carbon-components-angular';
import { TableModel } from 'carbon-components-angular/table';

import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import {
  Application,
  CreateApplicationDto,
} from '../../../types/application-overview.type';
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
    // Carbon modal needs both the module (providers) and a placeholder in the
    // view tree; keep it close to where the modal is opened.
    ModalModule,
    PlaceholderModule,
    UiPlatformOverflowMenuComponent,
    MatCardModule,
    ApplicationsCollectionAccordionComponent,
    UiTextInputComponent,
    ReactiveFormsModule,
  ],
  template: `
    @if (isSmallScreen) {
      <section class="mx-4 mt-8 text-black">
        <h3 class="text-2xl">Applications</h3>
        <p class="mt-2 mb-4">Manage applications and their subscribers.</p>
        <ui-button
          size="sm"
          class="mb-4"
          (buttonClick)="openAddApplicationModal()"
        >
          Add
        </ui-button>
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
        [primaryActionLabel]="'Add'"
        (primaryActionClick)="openAddApplicationModal()"
      ></ui-table>
    }

    <ng-template #actionTemplate let-data="data">
      <ui-button
        size="sm"
        icon="faBan"
        variant="ghost"
        (click)="onRevokeAccess(data.userId, data.applicationId)"
      >
        Revoke access
      </ui-button>
    </ng-template>

    <ng-template #deleteTemplate let-data="data">
      <ui-platform-overflow-menu
        icon="faEllipsisV"
        [menuOptions]="menuOptions"
        (menuOptionSelected)="onMenuOptionSelected($event, data)"
      ></ui-platform-overflow-menu>
    </ng-template>

    <ng-template #applicationFormTemplate let-form="form">
      <form [formGroup]="applicationForm" class="space-y-4">
        <ui-text-input
          label="Application Name"
          formControlName="name"
          theme="light"
          ngDefaultControl
        />
        <ui-text-input
          label="Description"
          formControlName="description"
          theme="light"
          ngDefaultControl
        />
        <ui-text-input
          label="Icon URL"
          formControlName="iconUrl"
          theme="light"
          ngDefaultControl
        />
        <ui-text-input
          label="Route Path"
          formControlName="routePath"
          theme="light"
          ngDefaultControl
        />
        <ui-text-input
          label="Tags (comma-separated)"
          formControlName="tags"
          theme="light"
          ngDefaultControl
        />
      </form>
    </ng-template>

  `,
})
export class ApplicationsCollectionContainer implements OnInit {
  private breakpointObserver = inject(BreakpointObserver);
  isSmallScreen = false;

  @ViewChild('actionTemplate', { static: true })
  actionTemplate!: TemplateRef<unknown>;
  @ViewChild('deleteTemplate', { static: true })
  deleteTemplate!: TemplateRef<unknown>;
  @ViewChild('applicationFormTemplate', { static: true })
  applicationFormTemplate!: TemplateRef<unknown>;

  menuOptions = OVERFLOW_MENU_CONFIG;
  tableModel = new TableModel();

  adminService: AdminService = inject(AdminService);
  tableUtils: TableUtilsService = inject(TableUtilsService);
  modalUtils: CustomModalService = inject(CustomModalService);
  router = inject(Router);
  fb = inject(FormBuilder);

  applicationForm = this.fb.group({
    name: ['', Validators.required],
    description: [''],
    iconUrl: [''],
    routePath: [''],
    tags: [''],
  });

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

  openAddApplicationModal() {
    this.applicationForm.reset();
    this.applicationForm.markAsPristine();
    this.applicationForm.markAsUntouched();

    this.modalUtils.openModal({
      header: MODAL_CONFIG.addApplication.header,
      template: this.applicationFormTemplate,
      context: { form: this.applicationForm },
      onSave: () => {
        if (this.applicationForm.invalid) return;
        const formValue = this.applicationForm.value;
        this.handleAddApplication({
          name: formValue.name ?? '',
          description: formValue.description ?? '',
          iconUrl: formValue.iconUrl ?? '',
          routePath: formValue.routePath ?? '',
          tags: formValue.tags
            ? formValue.tags.split(',').map((tag) => tag.trim())
            : [],
        });
      },
    });
  }

  openEditApplicationModal(application: Application) {
    this.applicationForm.setValue({
      name: application.name,
      description: application.description,
      iconUrl: application.iconUrl,
      routePath: application.routePath,
      tags: application.tags?.join(', ') || '',
    });

    this.modalUtils.openModal({
      header: MODAL_CONFIG.editApplication(application).header,
      template: this.applicationFormTemplate,
      context: { form: this.applicationForm },
      onSave: () => {
        if (this.applicationForm.invalid) return;
        const formValue = this.applicationForm.value;
        this.handleEditApplication({
          ...application,
          name: formValue.name ?? application.name,
          description: formValue.description ?? application.description,
          iconUrl: formValue.iconUrl ?? application.iconUrl,
          routePath: formValue.routePath ?? application.routePath,
          tags: formValue.tags
            ? formValue.tags.split(',').map((tag) => tag.trim())
            : application.tags ?? [],
        });
      },
    });
  }

  openDeleteConfirmationModal(application: Application) {
    this.modalUtils.openModal({
      ...MODAL_CONFIG.deleteApplication(application.name),
      onSave: () => this.handleDeleteApplication(application.id),
    });
  }

  openRevokeAccessConfirmationModal(userId: number, applicationId: number) {
    this.modalUtils.openModal({
      ...MODAL_CONFIG.revokeAccess(userId, applicationId),
      onSave: () => this.handleRevokeAccess(userId, applicationId),
    });
  }

  handleAddApplication(formData: CreateApplicationDto) {
    this.addApplicationMutation.mutate(formData, {
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
