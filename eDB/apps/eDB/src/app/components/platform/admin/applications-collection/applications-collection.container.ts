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
  UiIconButtonComponent,
  UiModalComponent,
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
    UiIconButtonComponent,
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
      (addApplication)="openModal()"
    ></ui-table>

    <ng-template #actionTemplate let-data="data">
      <ui-button
        [size]="'sm'"
        [icon]="'faBan'"
        [variant]="'danger'"
        (click)="onRevokeAccess(data.userId, data.applicationId)"
        >Revoke access</ui-button
      >
    </ng-template>
    <ng-template #deleteTemplate let-data="data">
      <ui-icon-button
        [size]="'sm'"
        [icon]="'faTrash'"
        (click)="onDeleteApplication(data.applicationId)"
      ></ui-icon-button>
    </ng-template>
  `,
})
export class SubscriptionsTableComponent implements OnChanges {
  @Input() applications: ApplicationOverviewDto[] | undefined;

  @ViewChild('actionTemplate', { static: true })
  actionTemplate!: TemplateRef<any>;

  @ViewChild('deleteTemplate', { static: true })
  deleteTemplate!: TemplateRef<any>;
  tableModel = new TableModel();

  tableUtils = inject(TableUtilsService);
  adminService = inject(AdminService);
  modalService = inject(ModalService);

  @Output() rowClicked = new EventEmitter<number>();
  @Output() revokeSubscription = new EventEmitter<{
    userId: number;
    applicationId: number;
  }>();

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

  deleteApplicationMutation = this.adminService.deleteApplication();

  onDeleteApplication(applicationId: number) {
    this.deleteApplicationMutation.mutate(applicationId, {
      onSuccess: () => {
        console.log('Application added successfully');
      },
      onError: (error) => {
        console.error('Failed to add application:', error);
      },
    });
  }

  openModal() {
    const modalRef = this.modalService.create<UiModalComponent>({
      component: UiModalComponent,
    });

    modalRef.instance.save.subscribe((formData: CreateApplicationDto) => {
      this.handleAddApplication(formData);
      modalRef.destroy();
    });

    modalRef.instance.close.subscribe(() => {
      modalRef.destroy();
    });
  }

  addApplicationMutation = this.adminService.addApplicationMutation();

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
    this.rowClicked.emit(index);
  }
}
