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
  signal,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';

import { AdminService } from '@eDB/client-admin';
import { TableUtilsService } from '@edb/util-common';
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
        @if (applicationsQuery.isLoading()) {
          <p class="text-sm text-gray-600">Loading applications…</p>
        } @else if (applicationsQuery.isError()) {
          <p class="text-sm text-red-600">
            Could not load applications. Please try again.
          </p>
        } @else if (applications().length === 0) {
          <p class="text-sm text-gray-600">No applications found.</p>
        }
      </section>
    } @else {
      @if (applicationsQuery.isLoading()) {
        <section class="py-6">
          <h3 class="text-2xl">Applications</h3>
          <p class="mt-2 text-sm text-gray-600">Loading applications…</p>
        </section>
      } @else if (applicationsQuery.isError()) {
        <section class="py-6">
          <h3 class="text-2xl">Applications</h3>
          <p class="mt-2 text-sm text-red-600">
            Could not load applications. Please try again.
          </p>
        </section>
      } @else {
        <ui-table
          title="Applications"
          description="Manage applications, launch routes, tags and subscribers."
          [model]="tableModel()"
          [showSelectionColumn]="false"
          [showButton]="true"
          [primaryActionLabel]="'Add'"
          (primaryActionClick)="openAddApplicationModal()"
        ></ui-table>
      }
    }

    <ng-template #deleteTemplate let-data="data">
      <ui-platform-overflow-menu
        icon="faEllipsisV"
        [menuOptions]="menuOptions"
        (menuOptionSelected)="onMenuOptionSelected($event, data)"
      ></ui-platform-overflow-menu>
    </ng-template>

    @if (isApplicationModalOpen()) {
      <div
        class="fixed inset-0 z-[1000] flex items-center justify-center bg-black/50 p-4"
        role="presentation"
      >
        <section
          class="w-full max-w-2xl rounded-2xl bg-white p-6 text-black shadow-2xl"
          role="dialog"
          aria-modal="true"
          [attr.aria-label]="applicationModalTitle()"
        >
          <header class="mb-6 flex items-start justify-between gap-4">
            <div>
              <p class="text-sm uppercase tracking-[0.18em] text-gray-500">
                Application
              </p>
              <h3 class="mt-1 text-3xl font-semibold">
                {{ applicationModalTitle() }}
              </h3>
              <p class="mt-2 text-sm text-gray-600">
                Configure the catalog entry shown to users.
              </p>
            </div>
            <button
              type="button"
              class="rounded-full px-3 py-1 text-3xl leading-none text-gray-500 hover:bg-gray-100 hover:text-black"
              aria-label="Close application modal"
              (click)="closeApplicationModal()"
            >
              ×
            </button>
          </header>

          <form [formGroup]="applicationForm" class="grid gap-4">
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

          @if (applicationForm.invalid && applicationForm.touched) {
            <p class="mt-4 text-sm text-red-600">
              Name, description and route path are required.
            </p>
          }

          <footer class="mt-8 flex flex-wrap justify-end gap-3">
            <ui-button
              variant="tertiary"
              size="sm"
              (buttonClick)="closeApplicationModal()"
            >
              Cancel
            </ui-button>
            <ui-button
              variant="primary"
              size="sm"
              [loading]="
                addApplicationMutation.isPending() ||
                editApplicationMutation.isPending()
              "
              (buttonClick)="submitApplicationModal()"
            >
              {{ applicationModalMode() === 'add' ? 'Add' : 'Save' }}
            </ui-button>
          </footer>
        </section>
      </div>
    }
  `,
})
export class ApplicationsCollectionContainer implements OnInit {
  private breakpointObserver = inject(BreakpointObserver);
  isSmallScreen = false;

  @ViewChild('deleteTemplate', { static: true })
  deleteTemplate!: TemplateRef<unknown>;

  menuOptions = OVERFLOW_MENU_CONFIG;
  tableModel = signal(new TableModel());

  adminService: AdminService = inject(AdminService);
  tableUtils: TableUtilsService = inject(TableUtilsService);
  modalUtils: CustomModalService = inject(CustomModalService);
  router = inject(Router);
  fb = inject(FormBuilder);

  applicationForm = this.fb.group({
    name: ['', Validators.required],
    description: ['', Validators.required],
    iconUrl: [''],
    routePath: ['', Validators.required],
    tags: [''],
  });

  protected applicationsQuery = this.adminService.queryApplications();
  addApplicationMutation = this.adminService.addApplicationMutation();
  editApplicationMutation = this.adminService.editApplicationMutation();
  deleteApplicationMutation = this.adminService.deleteApplicationMutation();
  applications = computed(() => this.applicationsQuery.data() || []);
  isApplicationModalOpen = signal(false);
  applicationModalMode = signal<'add' | 'edit'>('add');
  editingApplication = signal<Application | null>(null);
  applicationModalTitle = computed(() =>
    this.applicationModalMode() === 'add'
      ? 'Add Application'
      : 'Edit Application',
  );

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
    const tableModel = new TableModel();
    tableModel.header = APPLICATION_TABLE_CONFIG.headers;
    tableModel.data = this.tableUtils.createExpandedData(
      applications,
      APPLICATION_TABLE_CONFIG,
      {
        nonExpandedActionTemplate: this.deleteTemplate,
      },
    );
    this.tableModel.set(tableModel);
  }

  clearTable() {
    const tableModel = new TableModel();
    tableModel.header = APPLICATION_TABLE_CONFIG.headers;
    tableModel.data = [];
    this.tableModel.set(tableModel);
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

  openAddApplicationModal() {
    this.applicationForm.reset();
    this.applicationForm.markAsPristine();
    this.applicationForm.markAsUntouched();
    this.applicationModalMode.set('add');
    this.editingApplication.set(null);
    this.isApplicationModalOpen.set(true);
  }

  openEditApplicationModal(application: Application) {
    this.applicationForm.setValue({
      name: application.name,
      description: application.description,
      iconUrl: application.iconUrl,
      routePath: application.routePath,
      tags: application.tags?.join(', ') || '',
    });
    this.applicationForm.markAsPristine();
    this.applicationForm.markAsUntouched();
    this.applicationModalMode.set('edit');
    this.editingApplication.set(application);
    this.isApplicationModalOpen.set(true);
  }

  closeApplicationModal(): void {
    this.isApplicationModalOpen.set(false);
    this.editingApplication.set(null);
    this.applicationForm.reset();
  }

  submitApplicationModal(): void {
    if (this.applicationForm.invalid) {
      this.applicationForm.markAllAsTouched();
      return;
    }

    const formValue = this.applicationForm.getRawValue();
    const tags = this.parseTags(formValue.tags);

    if (this.applicationModalMode() === 'add') {
      this.handleAddApplication(
        {
          name: formValue.name ?? '',
          description: formValue.description ?? '',
          iconUrl: formValue.iconUrl ?? '',
          routePath: formValue.routePath ?? '',
          tags,
        },
        () => this.closeApplicationModal(),
      );
      return;
    }

    const application = this.editingApplication();
    if (!application) return;

    this.handleEditApplication(
      {
        ...application,
        name: formValue.name ?? application.name,
        description: formValue.description ?? application.description,
        iconUrl: formValue.iconUrl ?? application.iconUrl,
        routePath: formValue.routePath ?? application.routePath,
        tags,
      },
      () => this.closeApplicationModal(),
    );
  }

  openDeleteConfirmationModal(application: Application) {
    this.modalUtils.openModal({
      ...MODAL_CONFIG.deleteApplication(application.name),
      onSave: () => this.handleDeleteApplication(application.id),
    });
  }

  handleAddApplication(formData: CreateApplicationDto, onSuccess?: () => void) {
    this.addApplicationMutation.mutate(formData, {
      onSuccess: async () => {
        console.log('Application added successfully');
        await this.applicationsQuery.refetch();
        onSuccess?.();
      },
      onError: (err) => console.error('Failed to add application', err),
    });
  }

  handleDeleteApplication(applicationId: number) {
    this.deleteApplicationMutation.mutate(applicationId, {
      onSuccess: async () => {
        console.log('Application deleted successfully');
        await this.applicationsQuery.refetch();
      },
      onError: (err) => console.error('Failed to delete application', err),
    });
  }

  handleEditApplication(newApplication: Application, onSuccess?: () => void) {
    this.editApplicationMutation.mutate(newApplication, {
      onSuccess: async () => {
        console.log('Application edited successfully');
        await this.applicationsQuery.refetch();
        onSuccess?.();
      },
      onError: (err) => console.error('Failed to edit application', err),
    });
  }

  private parseTags(tags: string | null | undefined): string[] {
    return (tags ?? '')
      .split(',')
      .map((tag) => tag.trim())
      .filter(Boolean);
  }
}
