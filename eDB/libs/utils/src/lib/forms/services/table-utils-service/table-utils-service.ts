// shared/services/table-utils.service.ts
import { Injectable, TemplateRef } from '@angular/core';
import { TableHeaderItem, TableItem } from 'carbon-components-angular';
import { RowMapperConfig, TableColumnConfig } from '../../models/table.model';

@Injectable({
  providedIn: 'root',
})
export class TableUtilsService {
  // Generates table headers dynamically from column configurations
  getTableHeaders(columnConfigs: TableColumnConfig[]): TableHeaderItem[] {
    return columnConfigs.map(
      (config) =>
        new TableHeaderItem({
          data: config.header,
          sortable: config.sortable,
          metadata: {
            sortField: config.sortField || null,
            backendSortField: config.backendSortField || null,
          },
        })
    );
  }

  // Maps rows to table items dynamically based on the mapper configuration
  prepareData<T>(
    rows: T[],
    mapperConfigs: RowMapperConfig<T>[],
    overflowTemplate?: TemplateRef<any>
  ): TableItem[][] {
    return rows.map((row) =>
      mapperConfigs.map(
        (config) =>
          new TableItem({
            data: config.isTemplate ? row : (row as any)[config.field],
            template: config.isTemplate ? overflowTemplate : null,
          })
      )
    );
  }
}
