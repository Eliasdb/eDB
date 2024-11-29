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
} from './subscriptions-table.config';

@Component({
  standalone: true,
  selector: 'platform-admin-subscriptions-table',
  imports: [
    CommonModule,
    UiTableComponent,
    UiButtonComponent,
    PlaceholderModule,
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
    <cds-placeholder></cds-placeholder>
    <ng-template #actionTemplate let-data="data">
      <ui-button
        [size]="'sm'"
        [icon]="'faBan'"
        [variant]="'danger'"
        (click)="onRevokeAccess(data.userId, data.applicationId)"
        >Revoke access</ui-button
      >
    </ng-template>
  `,
})
export class PlatformAdminSubscriptionsTableComponent implements OnChanges {
  @Input() applications: ApplicationOverviewDto[] | undefined;
  @ViewChild('actionTemplate', { static: true })
  actionTemplate!: TemplateRef<any>;
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

  openModal() {
    const modalRef = this.modalService.create<UiModalComponent>({
      component: UiModalComponent,
      inputs: {
        modalText: 'Hallo Wereld',
      },
    });

    // Subscribe to the save event
    modalRef.instance.save.subscribe((formData: CreateApplicationDto) => {
      this.handleAddApplication(formData);
      modalRef.destroy(); // Close the modal after saving
    });

    // Subscribe to the close event
    modalRef.instance.close.subscribe(() => {
      modalRef.destroy(); // Close the modal when canceled
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
