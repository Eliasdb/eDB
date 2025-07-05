import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output, input, model } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PaginationModule, TableModule } from 'carbon-components-angular';
import { TableItem, TableModel } from 'carbon-components-angular/table';
import { UiButtonComponent } from '../../buttons/button/button.component';

export interface SortEvent {
  sortField: string;
  sortDirection: 'asc' | 'desc';
}

@Component({
  selector: 'ui-table',
  standalone: true,
  imports: [
    TableModule,
    PaginationModule,
    FormsModule,
    UiButtonComponent,
    CommonModule,
  ],
  template: `
    <cds-table-container>
      <!-- optional header -->
      <cds-table-header *ngIf="showHeader()" class="table-header-container">
        <div>
          <h4 cdsTableHeaderTitle style="margin:0;">{{ title() }}</h4>
          <p cdsTableHeaderDescription style="margin:0;">{{ description() }}</p>
        </div>

        @if (showButton()) {
          <div>
            <ui-button
              size="sm"
              icon="faPlus"
              (buttonClick)="onPrimaryActionClick()"
            >
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
              [placeholder]="searchPlaceholder()"
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
        [size]="tableSize()"
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
  /* ---------- configurable inputs ---------- */
  readonly title = input<string>('Table Title');
  readonly description = input<string>('Table description goes here.');
  readonly model = input<TableModel>(new TableModel());
  readonly sortable = input<boolean>(true);
  readonly showSelectionColumn = input<boolean>(true);
  readonly stickyHeader = input<boolean>(false);
  readonly isDataGrid = input<boolean>(false);
  readonly showPagination = input<boolean>(false);
  readonly skeleton = input<boolean>(false);
  readonly striped = input<boolean>(false);
  readonly showToolbar = input<boolean>(false);
  readonly showButton = input<boolean>(false);

  /** NEW – hide or show the Carbon table header */
  readonly showHeader = input<boolean>(true);

  /** NEW – tweak search placeholder copy */
  readonly searchPlaceholder = input<string>('Search…');

  /** NEW – 'sm' for dense rows, 'md' or 'lg' for default */
  readonly tableSize = input<'sm' | 'md' | 'lg'>('md');

  /** label for the primary CTA when `showButton` is true */
  readonly primaryActionLabel = input<string>('Add item');

  /* ---------- outputs ---------- */
  @Output() rowClicked = new EventEmitter<TableItem[]>();
  @Output() pageChanged = new EventEmitter<number>();
  @Output() sortChanged = new EventEmitter<SortEvent>();
  @Output() searchChanged = new EventEmitter<string>();
  @Output() primaryActionClick = new EventEmitter<void>();

  /* ---------- internal state ---------- */
  searchTerm = model<string>('');

  /* ---------- table events ---------- */
  onRowClick(index: number): void {
    const row = this.model().data[index];
    if (row) this.rowClicked.emit(row);
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
    if (!headerItem) return;

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
