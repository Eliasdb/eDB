// src/app/shared/services/table-utils.service.ts

import { Injectable, TemplateRef } from '@angular/core';
import { TableHeaderItem, TableItem } from 'carbon-components-angular';
import {
  ExpandedDataConfig,
  RowMapperConfig,
  TableColumnConfig,
} from '../../models/table.model';

@Injectable({
  providedIn: 'root',
})
export class TableUtilsService {
  /**
   * Generates table headers dynamically from column configurations.
   * @param columnConfigs Array of column configurations.
   * @returns Array of TableHeaderItem.
   */
  getTableHeaders(
    columnConfigs: TableColumnConfig[],
    activeSortField?: string,
    activeSortDirection?: 'asc' | 'desc',
  ): TableHeaderItem[] {
    return columnConfigs.map(
      (config) =>
        new TableHeaderItem({
          data: config.header,
          sortable: config.sortable,
          sorted: config.sortField === activeSortField,
          ascending:
            activeSortField === config.sortField &&
            activeSortDirection === 'asc',
          metadata: {
            sortField: config.sortField || null,
          },
        }),
    );
  }

  /**
   * Maps rows to table items dynamically based on the mapper configuration.
   * Supports expandable rows by handling `isExpandable` and `getExpandedData`.
   * @param rows Array of data rows.
   * @param mapperConfigs Array of row mapper configurations.
   * @param overflowTemplate Optional template for action columns.
   * @returns Array of TableItem arrays.
   */
  prepareData<T>(
    rows: T[],
    mapperConfigs: RowMapperConfig<T>[],
    overflowTemplate?: TemplateRef<unknown>,
  ): TableItem[][] {
    return rows.map((row) =>
      mapperConfigs.map((config) => {
        const record = row as Record<string, unknown>;
        let data = record[config.field];

        // Use valueGetter if provided to transform the data
        if (config.valueGetter) {
          data = config.valueGetter(row);
        }

        const tableItem = new TableItem({
          data: config.isTemplate ? row : data,
          template: config.isTemplate ? overflowTemplate : null,
        });

        // Handle expandable rows
        if (config.isExpandable && config.getExpandedData) {
          tableItem.expandedData = config.getExpandedData(row);
          tableItem.expandAsTable = true;
        }

        return tableItem;
      }),
    );
  }

  createExpandedData<T>(
    items: T[],
    config: ExpandedDataConfig<T>,
    context?: Record<string, unknown>,
  ): TableItem[][] {
    const { rowMapper, expandedDataMapper } = config;

    return items.map((item) => {
      const row = rowMapper(item, context);

      if (expandedDataMapper) {
        const expandedData = expandedDataMapper(item, context);

        // Create a new TableItem for expandable rows
        const expandedItem = new TableItem({
          data: row[0].data,
          expandedData, // Attach expanded data
          expandAsTable: true, // Ensure this is set during initialization
        });

        row[0] = expandedItem; // Replace the first column with the expanded item
      }

      return row;
    });
  }
}
