import { Component, EventEmitter, Output, input, model } from '@angular/core';
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
  imports: [TableModule, PaginationModule, FormsModule, UiButtonComponent],
  template: `
    <cds-table-container>
      <cds-table-header class="table-header-container">
        <div>
          <h4 cdsTableHeaderTitle style="margin:0;">{{ title() }}</h4>
          <p cdsTableHeaderDescription style="margin:0;">{{ description() }}</p>
        </div>

        @if (showButton()) {
          <ui-button size="sm" icon="faPlus" (click)="onAddApplication()">
            Add application
          </ui-button>
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

  @Output() rowClicked = new EventEmitter<number>();
  @Output() pageChanged = new EventEmitter<number>();
  @Output() sortChanged = new EventEmitter<SortEvent>();
  @Output() searchChanged = new EventEmitter<string>();
  @Output() addApplication = new EventEmitter<void>();

  // Input for searchTerm
  searchTerm = model<string>();

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
