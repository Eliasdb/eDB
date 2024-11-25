import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { PaginationModule } from 'carbon-components-angular';
import { TableModel, TableModule } from 'carbon-components-angular/table';

@Component({
  selector: 'ui-table',
  standalone: true,
  imports: [CommonModule, TableModule, PaginationModule],
  template: `
    <cds-table-container>
      <cds-table-header>
        <h4 cdsTableHeaderTitle>{{ title }}</h4>
        <p cdsTableHeaderDescription>{{ description }}</p>
      </cds-table-header>

      <cds-table
        [model]="model"
        [sortable]="sortable"
        [showSelectionColumn]="showSelectionColumn"
        [stickyHeader]="stickyHeader"
        [isDataGrid]="isDataGrid"
        (rowClick)="onRowClick($event)"
        [skeleton]="skeleton"
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
  @Input() showPagination = true;
  @Input() skeleton = false;

  @Output() rowClicked = new EventEmitter<number>();
  @Output() pageChanged = new EventEmitter<number>();

  onRowClick(index: number): void {
    this.rowClicked.emit(index);
  }

  onPageChange(page: number): void {
    this.pageChanged.emit(page);
  }
}
