import { TableHeaderItem, TableItem } from 'carbon-components-angular';

export interface User {
  id?: number;
  email: string;
  password?: string; // Only required during registration
  firstName: string;
  lastName: string;
  country?: string; // Optional since it's not required for login
  state?: string;
  phoneNumber?: string;
  company?: string;
  role?: number; // User roles, e.g., Admin, User
}

export interface LinkItem {
  id: string;
  label: string;
  active?: boolean;
}

/**
 * Generic configuration for creating expanded table data.
 */
export interface ExpandedDataConfig<T> {
  headers: TableHeaderItem[]; // Correct type for headers
  rowMapper: (item: T, context?: { [key: string]: any }) => TableItem[];
  expandedDataMapper?: (
    item: T,
    context?: { [key: string]: any },
  ) => TableItem[][];
}
