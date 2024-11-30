import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PaginationModule, TableModule } from 'carbon-components-angular';
import { TableModel } from 'carbon-components-angular/table';
import { UiButtonComponent } from '../../buttons/button/button.component';

export interface SortEvent {
  sortField: string;
  sortDirection: 'asc' | 'desc';
}

@Component({
  selector: 'ui-table',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    PaginationModule,
    FormsModule,
    UiButtonComponent,
  ],
  template: `
    <cds-table-container>
      <cds-table-header class="table-header-container">
        <div>
          <h4 cdsTableHeaderTitle style="margin:0;">{{ title }}</h4>
          <p cdsTableHeaderDescription style="margin:0;">{{ description }}</p>
        </div>

        <ng-container *ngIf="showButton">
          <ui-button size="sm" icon="faPlus" (click)="onAddApplication()">
            Add application
          </ui-button>
        </ng-container>
      </cds-table-header>

      <ng-container *ngIf="showToolbar">
        <cds-table-toolbar #toolbar [model]="model">
          <cds-table-toolbar-actions>
            <ui-button (buttonClick)="onDelete()" icon="faTrash">
              Delete
            </ui-button>
          </cds-table-toolbar-actions>
          <cds-table-toolbar-content>
            <cds-table-toolbar-search
              ngDefaultControl
              [(ngModel)]="searchTerm"
              (ngModelChange)="onSearchChanged($event)"
              placeholder="Search..."
            ></cds-table-toolbar-search>
          </cds-table-toolbar-content>
        </cds-table-toolbar>
      </ng-container>

      <cds-table
        [model]="model"
        [sortable]="sortable"
        [showSelectionColumn]="showSelectionColumn"
        [stickyHeader]="stickyHeader"
        [isDataGrid]="isDataGrid"
        (rowClick)="onRowClick($event)"
        (sort)="emitSortEvent($event)"
        [skeleton]="skeleton"
        [striped]="striped"
      ></cds-table>

      <cds-pagination
        *ngIf="showPagination"
        [model]="model"
        (selectPage)="onPageChange($event)"
      ></cds-pagination>
    </cds-table-container>
  `,
  styleUrls: ['table.component.scss'],
})
export class UiTableComponent {
  @Input() title = 'Table Title';
  @Input() description = 'Table description goes here.';
  @Input() model: TableModel = new TableModel();
  @Input() sortable = true;
  @Input() showSelectionColumn = true;
  @Input() stickyHeader = false;
  @Input() isDataGrid = false;
  @Input() showPagination = false;
  @Input() skeleton = false;
  @Input() striped = false;
  @Input() showToolbar = false;
  @Input() showButton = false;
  @Input() searchTerm: string = '';

  @Output() rowClicked = new EventEmitter<number>();
  @Output() pageChanged = new EventEmitter<number>();
  @Output() sortChanged = new EventEmitter<SortEvent>();
  @Output() searchChanged = new EventEmitter<string>();
  @Output() addApplication = new EventEmitter<void>();

  onRowClick(index: number): void {
    this.rowClicked.emit(index);
  }

  onAddApplication(): void {
    this.addApplication.emit();
  }

  onPageChange(page: number): void {
    this.pageChanged.emit(page);
  }

  onDelete(): void {
    console.log('Delete action triggered');
    // Emit an event or handle deletion logic here
  }

  onSearchChanged(value: string): void {
    this.searchChanged.emit(value.trim());
  }

  emitSortEvent(index: number): void {
    const headerItem = this.model.header[index];
    if (!headerItem) {
      console.warn(`No header found for index: ${index}`);
      return;
    }

    const sortFieldRaw =
      headerItem.metadata?.sortField?.toLowerCase() ||
      headerItem.data.toString().toLowerCase().replace(/\s+/g, '');
    const currentDirection = headerItem.ascending ? 'asc' : 'desc';
    const newDirection = currentDirection === 'asc' ? 'desc' : 'asc';

    this.sortChanged.emit({
      sortField: sortFieldRaw,
      sortDirection: newDirection,
    });
  }
}
