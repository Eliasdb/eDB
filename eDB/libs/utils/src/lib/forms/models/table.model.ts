// src/app/models/table.model.ts

import { TableItem } from 'carbon-components-angular';

/**
 * Configuration for table columns.
 */
export interface TableColumnConfig {
  header: string;
  field?: string;
  sortable?: boolean;
  sortField?: string;
  isTemplate?: boolean; // Indicates if the column uses a template (e.g., for actions)
}

/**
 * Configuration for mapping data rows to TableItem.
 */
export interface RowMapperConfig<T> {
  field: string;
  isTemplate?: boolean; // Indicates if this field uses a template (e.g., actions column)
  isExpandable?: boolean; // Indicates if this column is expandable
  getExpandedData?: (row: T) => TableItem[][]; // Function to retrieve expanded data
  valueGetter?: (row: T) => any; // Function to transform the field's data
}

export interface SubscribedUserDto {
  userName: string;
  userEmail: string;
  subscriptionDate: string;
  userId: number;
}

export interface ApplicationOverviewDto {
  applicationName: string;
  applicationDescription: string;
  subscribedUsers: SubscribedUserDto[];
  applicationId: number;
}
