import { Component, EventEmitter, Output, input, model } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PaginationModule, TableModule } from 'carbon-components-angular';
import { TableItem, TableModel } from 'carbon-components-angular/table';
import { UiButtonComponent } from '../../buttons/button/button.component';

export interface SortEvent {
  sortField: string;
  sortDirection: 'asc' | 'desc';
}

interface TableRowClickEvent {
  row: TableItem[];
}

@Component({
  selector: 'ui-table',
  standalone: true,
  imports: [TableModule, PaginationModule, FormsModule, UiButtonComponent],
  template: `
    <cds-table-container>
      <cds-table-header class="table-header-container">
        <div>
          <h4 cdsTableHeaderTitle style="margin:0;">{{ title() }}</h4>
          <p cdsTableHeaderDescription style="margin:0;">{{ description() }}</p>
        </div>
        @if (showButton()) {
          <div>
            <ui-button size="sm" icon="faPlus" (click)="onPrimaryActionClick()">
              {{ primaryActionLabel() }}
            </ui-button>
          </div>
        }
      </cds-table-header>

      @if (showToolbar()) {
        <cds-table-toolbar #toolbar [model]="model()">
          <cds-table-toolbar-actions>
            <ui-button (buttonClick)="onDelete()" icon="faTrash">
              Delete
            </ui-button>
          </cds-table-toolbar-actions>
          <cds-table-toolbar-content>
            <cds-table-toolbar-search
              ngDefaultControl
              [(ngModel)]="searchTerm"
              placeholder="Search..."
              (ngModelChange)="searchChanged.emit($event.trim())"
            ></cds-table-toolbar-search>
          </cds-table-toolbar-content>
        </cds-table-toolbar>
      }

      <cds-table
        [model]="model()"
        [sortable]="sortable()"
        [showSelectionColumn]="showSelectionColumn()"
        [stickyHeader]="stickyHeader()"
        [isDataGrid]="isDataGrid()"
        (rowClick)="onRowClick($event)"
        (sort)="emitSortEvent($event)"
        [skeleton]="skeleton()"
        [striped]="striped()"
      ></cds-table>

      @if (showPagination()) {
        <cds-pagination
          [model]="model()"
          (selectPage)="onPageChange($event)"
        ></cds-pagination>
      }
    </cds-table-container>
  `,
  styleUrls: ['table.component.scss'],
})
export class UiTableComponent {
  readonly title = input('Table Title');
  readonly description = input('Table description goes here.');
  readonly model = input<TableModel>(new TableModel());
  readonly sortable = input(true);
  readonly showSelectionColumn = input(true);
  readonly stickyHeader = input(false);
  readonly isDataGrid = input(false);
  readonly showPagination = input(false);
  readonly skeleton = input(false);
  readonly striped = input(false);
  readonly showToolbar = input(false);
  readonly showButton = input(false);
  readonly primaryActionLabel = input('Add item');

  @Output() rowClicked = new EventEmitter<TableItem[]>();
  @Output() pageChanged = new EventEmitter<number>();
  @Output() sortChanged = new EventEmitter<SortEvent>();
  @Output() searchChanged = new EventEmitter<string>();
  @Output() primaryActionClick = new EventEmitter<void>();

  searchTerm = model<string>();

  onRowClick(index: number): void {
    const row = this.model().data[index];
    if (row) {
      this.rowClicked.emit(row);
    }
  }

  onPrimaryActionClick(): void {
    this.primaryActionClick.emit();
  }

  onPageChange(page: number): void {
    this.pageChanged.emit(page);
  }

  onDelete(): void {
    console.log('Delete action triggered');
  }

  emitSortEvent(index: number): void {
    const headerItem = this.model().header[index];
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
