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
      <cds-table-header>
        <h4 cdsTableHeaderTitle style="margin:0;">{{ title }}</h4>
        <p cdsTableHeaderDescription style="margin:0;">{{ description }}</p>
      </cds-table-header>

      <ng-container *ngIf="showToolbar">
        <cds-table-toolbar #toolbar [model]="model">
          <cds-table-toolbar-actions>
            <ui-button
              [disabled]="toolbar.selected ? false : true"
              (buttonClick)="onDelete()"
              [icon]="'faTrash'"
            >
              Delete
            </ui-button>
          </cds-table-toolbar-actions>
          <cds-table-toolbar-content>
            <cds-table-toolbar-search
              ngDefaultControl
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
        (sort)="simpleSort($event)"
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
})
export class UiTableComponent {
  @Input() title = 'Table Title';
  @Input() description = 'Table description goes here.';
  @Input() model!: TableModel;
  @Input() sortable = true;
  @Input() showSelectionColumn = true;
  @Input() stickyHeader = false;
  @Input() isDataGrid = false;
  @Input() showPagination = false;
  @Input() skeleton = false;
  @Input() striped = false;
  @Input() showToolbar = false; // New input property with default false

  @Output() rowClicked = new EventEmitter<number>();
  @Output() pageChanged = new EventEmitter<number>();
  @Output() sortChanged = new EventEmitter<SortEvent>();

  onRowClick(index: number): void {
    this.rowClicked.emit(index);
  }

  onPageChange(page: number): void {
    this.pageChanged.emit(page);
  }
  onDelete(): void {
    console.log('Delete action triggered');
  }

  onPrimaryAction(): void {
    console.log('Primary action triggered');
  }

  /**
   * Handles the sort event emitted by the cds-table component.
   * @param index The index of the column to sort.
   */
  simpleSort(index: number): void {
    const headerItem = this.model.header[index];

    if (!headerItem) {
      console.warn(`No header found for index: ${index}`);
      return;
    }

    let sortDirection: 'asc' | 'desc' = 'asc';

    if (headerItem.sorted) {
      // Toggle the sorting direction
      headerItem.ascending = !headerItem.ascending;
      sortDirection = headerItem.ascending ? 'asc' : 'desc';
    } else {
      // Reset all other headers
      this.model.header.forEach((item) => {
        item.sorted = false;
        item.ascending = true;
      });
      // Set the sorting direction to ascending by default
      headerItem.sorted = true;
      headerItem.ascending = true;
      sortDirection = 'asc';
    }

    const sortField = headerItem.metadata?.sortField || headerItem.data;

    if (!sortField) {
      console.warn(`No sort field defined for column: ${headerItem.data}`);
      return;
    }

    console.log(
      `Emitting sort: Field=${sortField}, Direction=${sortDirection}`
    );
    this.sortChanged.emit({
      sortField,
      sortDirection,
    });
  }
}
