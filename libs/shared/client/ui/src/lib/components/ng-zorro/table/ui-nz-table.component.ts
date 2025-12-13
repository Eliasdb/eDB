import { CommonModule } from '@angular/common';
import { Component, Pipe, PipeTransform, computed, input } from '@angular/core';
import { NzTableModule, NzTableSize } from 'ng-zorro-antd/table';

/* -------------------- Pipe (declare BEFORE component) -------------------- */
@Pipe({
  name: 'formatNzTableCell',
  standalone: true,
})
export class FormatNzTableCellPipe implements PipeTransform {
  transform(value: unknown): string {
    if (value === null || value === undefined || value === '') return '--';
    return String(value);
  }
}

/* ------------------------------ Types ----------------------------------- */
export interface UiNzTableColumn<T = Record<string, unknown>> {
  key: keyof T | string;
  title: string;
  width?: string;
  align?: 'left' | 'center' | 'right';
  render?: (row: T) => string | number | null | undefined;
}

/* ---------------------------- Component --------------------------------- */
@Component({
  selector: 'ui-nz-table',
  standalone: true,
  imports: [CommonModule, NzTableModule, FormatNzTableCellPipe],
  host: { class: 'block' },
  template: `
    <nz-table
      [nzData]="data()"
      [nzBordered]="bordered()"
      [nzSize]="size()"
      [nzShowPagination]="showPagination()"
      [nzScroll]="scrollConfig()"
    >
      <thead>
        <tr>
          @for (column of columns(); track column.key ?? column.title) {
            <th
              [style.textAlign]="column.align ?? 'left'"
              [style.width]="column.width || null"
            >
              {{ column.title }}
            </th>
          }
        </tr>
      </thead>

      <tbody>
        @if (data().length) {
          @for (item of data(); track trackRow(item, $index)) {
            <tr>
              @for (column of columns(); track column.key ?? column.title) {
                <td
                  [style.textAlign]="column.align ?? 'left'"
                  [style.width]="column.width || null"
                >
                  @if (column.render) {
                    {{ column.render!(item) | formatNzTableCell }}
                  } @else {
                    {{ resolveValue(item, column.key) | formatNzTableCell }}
                  }
                </td>
              }
            </tr>
          }
        } @else {
          <tr>
            <td
              [attr.colspan]="columns().length"
              class="py-6 text-center text-sm text-slate-500"
            >
              {{ emptyState() }}
            </td>
          </tr>
        }
      </tbody>
    </nz-table>
  `,
})
export class UiNzTableComponent<
  T extends Record<string, unknown> = Record<string, unknown>,
> {
  /* Inputs */
  readonly columns = input<UiNzTableColumn<T>[]>([]);
  readonly data = input<T[]>([]);
  readonly bordered = input<boolean>(false);
  // NG-Zorro table sizes: 'small' | 'middle' | 'default'
  readonly size = input<NzTableSize>('default');
  readonly scrollX = input<string | null>(null);
  readonly showPagination = input<boolean>(false);
  readonly emptyState = input<string>('No data available');

  // Always return an object (never undefined/null) to satisfy the nzScroll type
  readonly scrollConfig = computed<{ x?: string | null; y?: string | null }>(
    () => {
      const x = this.scrollX();
      return x ? { x } : {};
    },
  );

  /* Tracking */
  trackRow(row: T, index: number): string | number {
    return (row as { id?: string | number })?.id ?? index;
  }

  /* Safe deep value resolver (supports dot paths) */
  resolveValue(row: T, key: keyof T | string): unknown {
    if (!row) return null;

    const path = String(key);

    if (path.includes('.')) {
      return path.split('.').reduce<unknown>((acc, part) => {
        if (acc && typeof acc === 'object') {
          return (acc as Record<string, unknown>)[part];
        }
        return undefined;
      }, row);
    }

    if (Object.prototype.hasOwnProperty.call(row, path)) {
      return (row as Record<string, unknown>)[path];
    }

    return undefined;
  }
}
