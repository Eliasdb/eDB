import { BreakpointObserver } from '@angular/cdk/layout';
import {
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
        <section class="applications-table-shell" aria-busy="true">
          <div class="applications-table-shell__header">
            <div>
              <h3 class="applications-table-shell__title">Applications</h3>
              <p class="applications-table-shell__description">
                Manage applications, launch routes, tags and subscribers.
              </p>
            </div>
            <ui-button size="sm" disabled>Add</ui-button>
          </div>

          <div class="applications-table-skeleton" role="status">
            <table>
              <thead>
                <tr>
                  <th></th>
                  <th>Application Name</th>
                  <th>Description</th>
                  <th>Route</th>
                  <th>Tags</th>
                  <th>Subscribers</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                @for (row of skeletonRows; track row) {
                  <tr>
                    <td>
                      <span class="skeleton-chevron"></span>
                    </td>
                    <td>
                      <span class="skeleton-cell skeleton-cell--name"></span>
                    </td>
                    <td>
                      <span class="skeleton-cell skeleton-cell--description"></span>
                    </td>
                    <td>
                      <span class="skeleton-cell skeleton-cell--route"></span>
                    </td>
                    <td>
                      <span class="skeleton-cell skeleton-cell--tags"></span>
                    </td>
                    <td>
                      <span class="skeleton-cell skeleton-cell--count"></span>
                    </td>
                    <td>
                      <span class="skeleton-action"></span>
                    </td>
                  </tr>
                }
              </tbody>
            </table>
            <span class="sr-only">Loading applications</span>
          </div>
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
        class="application-action-menu"
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

    @if (isDeleteModalOpen()) {
      <div
        class="application-modal-backdrop"
        role="presentation"
      >
        <section
          class="application-modal application-modal--confirm"
          role="dialog"
          aria-modal="true"
          aria-label="Delete application"
        >
          <header class="application-modal__header">
            <div>
              <p class="application-modal__eyebrow">Application</p>
              <h3 class="application-modal__title">Delete Application</h3>
              <p class="application-modal__description">
                This will permanently remove
                <strong>{{ deletingApplication()?.name }}</strong>
                from the catalog.
              </p>
            </div>
            <button
              type="button"
              class="application-modal__close"
              aria-label="Close delete modal"
              (click)="closeDeleteConfirmationModal()"
            >
              ×
            </button>
          </header>

          <footer class="application-modal__footer">
            <ui-button
              variant="tertiary"
              size="sm"
              (buttonClick)="closeDeleteConfirmationModal()"
            >
              Cancel
            </ui-button>
            <ui-button
              variant="primary"
              size="sm"
              [loading]="deleteApplicationMutation.isPending()"
              (buttonClick)="confirmDeleteApplication()"
            >
              Delete
            </ui-button>
          </footer>
        </section>
      </div>
    }
  `,
  styles: [
    `
      :host {
        display: block;
      }

      .applications-table-shell {
        border: 1px solid #d1d5db;
        border-radius: 0.5rem;
        background: #ffffff;
        color: #111827;
        padding: 1.25rem;
      }

      .applications-table-shell__header {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        gap: 1rem;
        margin-bottom: 1.75rem;
      }

      .applications-table-shell__title {
        margin: 0;
        font-size: 1.5rem;
        font-weight: 400;
        line-height: 1.2;
      }

      .applications-table-shell__description {
        margin: 0.25rem 0 0;
        font-size: 1rem;
        line-height: 1.35;
      }

      .applications-table-skeleton {
        overflow-x: auto;
      }

      .applications-table-skeleton table {
        width: 100%;
        min-width: 64rem;
        border-collapse: collapse;
      }

      .applications-table-skeleton th {
        background: #eff6ff;
        color: #262626;
        font-size: 0.875rem;
        font-weight: 700;
        padding: 0.875rem 1.125rem;
        text-align: left;
      }

      .applications-table-skeleton td {
        border-bottom: 1px solid #d1d5db;
        padding: 1.6rem 1.125rem;
        vertical-align: middle;
      }

      .applications-table-skeleton th:first-child,
      .applications-table-skeleton td:first-child {
        width: 3rem;
      }

      .applications-table-skeleton th:nth-child(6),
      .applications-table-skeleton td:nth-child(6),
      .applications-table-skeleton th:nth-child(7),
      .applications-table-skeleton td:nth-child(7) {
        width: 8rem;
      }

      .skeleton-cell,
      .skeleton-action,
      .skeleton-chevron {
        display: inline-block;
        overflow: hidden;
        position: relative;
        background: #e5eefb;
      }

      .skeleton-cell,
      .skeleton-action {
        border-radius: 999px;
        height: 0.9rem;
      }

      .skeleton-chevron {
        width: 0.75rem;
        height: 0.75rem;
        border-radius: 0.2rem;
      }

      .skeleton-action {
        width: 2rem;
        height: 2rem;
        border-radius: 0.5rem;
      }

      .skeleton-cell::after,
      .skeleton-action::after,
      .skeleton-chevron::after {
        content: '';
        position: absolute;
        inset: 0;
        transform: translateX(-100%);
        background: linear-gradient(
          90deg,
          transparent,
          rgba(255, 255, 255, 0.72),
          transparent
        );
        animation: skeleton-shimmer 1.35s infinite;
      }

      .skeleton-cell--name {
        width: 9rem;
      }

      .skeleton-cell--description {
        width: 15rem;
      }

      .skeleton-cell--route {
        width: 13rem;
      }

      .skeleton-cell--tags {
        width: 16rem;
      }

      .skeleton-cell--count {
        width: 2.5rem;
      }

      .sr-only {
        position: absolute;
        width: 1px;
        height: 1px;
        padding: 0;
        overflow: hidden;
        clip: rect(0, 0, 0, 0);
        white-space: nowrap;
        border: 0;
      }

      :host ::ng-deep ui-platform-overflow-menu.application-action-menu {
        display: inline-flex;
      }

      :host ::ng-deep ui-platform-overflow-menu.application-action-menu .cds--overflow-menu {
        width: 2.25rem;
        height: 2.25rem;
        min-height: 2.25rem;
        border-radius: 0.5rem;
      }

      :host ::ng-deep ui-platform-overflow-menu.application-action-menu .cds--overflow-menu__trigger {
        width: 2.25rem;
        height: 2.25rem;
      }

      :host ::ng-deep ui-platform-overflow-menu.application-action-menu .cds--overflow-menu__trigger div {
        padding: 0.5rem;
      }

      @keyframes skeleton-shimmer {
        100% {
          transform: translateX(100%);
        }
      }

      .application-modal-backdrop {
        position: fixed;
        inset: 0;
        z-index: 1000;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 1.5rem;
        background: rgba(17, 24, 39, 0.56);
      }

      .application-modal {
        width: min(100%, 48rem);
        max-height: calc(100vh - 3rem);
        overflow-y: auto;
        border-radius: 0.75rem;
        background: #ffffff;
        color: #1f2937;
        box-shadow:
          0 24px 80px rgba(15, 23, 42, 0.24),
          0 8px 24px rgba(15, 23, 42, 0.16);
        padding: 1.75rem;
      }

      .application-modal--confirm {
        max-width: 36rem;
      }

      .application-modal__header {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        gap: 1rem;
        margin-bottom: 2rem;
      }

      .application-modal__eyebrow {
        margin: 0;
        color: #6b7280;
        font-size: 0.75rem;
        font-weight: 500;
        letter-spacing: 0.22em;
        line-height: 1;
        text-transform: uppercase;
      }

      .application-modal__title {
        margin: 0.75rem 0 0;
        color: #262626;
        font-size: clamp(1.75rem, 3vw, 2.25rem);
        font-weight: 700;
        line-height: 1.1;
      }

      .application-modal__description {
        margin: 0.75rem 0 0;
        color: #4b5563;
        font-size: 0.95rem;
        line-height: 1.5;
      }

      .application-modal__close {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 2.5rem;
        height: 2.5rem;
        border: 0;
        border-radius: 999px;
        background: transparent;
        color: #6b7280;
        cursor: pointer;
        font-size: 2rem;
        line-height: 1;
      }

      .application-modal__close:hover {
        background: #f3f4f6;
        color: #111827;
      }

      .application-modal__footer {
        display: flex;
        flex-wrap: wrap;
        justify-content: flex-end;
        gap: 0.75rem;
        margin-top: 2rem;
      }

      @media (max-width: 640px) {
        .application-modal-backdrop {
          align-items: flex-end;
          padding: 0;
        }

        .application-modal {
          width: 100%;
          max-height: 92vh;
          border-radius: 1rem 1rem 0 0;
          padding: 1.25rem;
        }

        .application-modal__footer {
          flex-direction: column-reverse;
        }

        .application-modal__footer ui-button {
          width: 100%;
        }
      }
    `,
  ],
})
export class ApplicationsCollectionContainer implements OnInit {
  private breakpointObserver = inject(BreakpointObserver);
  isSmallScreen = false;
  protected readonly skeletonRows = Array.from({ length: 6 }, (_, index) => index);

  @ViewChild('deleteTemplate', { static: true })
  deleteTemplate!: TemplateRef<unknown>;

  menuOptions = OVERFLOW_MENU_CONFIG;
  tableModel = signal(new TableModel());

  adminService: AdminService = inject(AdminService);
  tableUtils: TableUtilsService = inject(TableUtilsService);
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
  isDeleteModalOpen = signal(false);
  deletingApplication = signal<Application | null>(null);
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
    this.deletingApplication.set(application);
    this.isDeleteModalOpen.set(true);
  }

  closeDeleteConfirmationModal(): void {
    this.isDeleteModalOpen.set(false);
    this.deletingApplication.set(null);
  }

  confirmDeleteApplication(): void {
    const application = this.deletingApplication();
    if (!application) return;

    this.handleDeleteApplication(application.id, () =>
      this.closeDeleteConfirmationModal(),
    );
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

  handleDeleteApplication(applicationId: number, onSuccess?: () => void) {
    this.deleteApplicationMutation.mutate(applicationId, {
      onSuccess: async () => {
        console.log('Application deleted successfully');
        await this.applicationsQuery.refetch();
        onSuccess?.();
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
