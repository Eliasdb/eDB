export interface TableColumnConfig {
  header: string;
  sortable: boolean;
  sortField?: string;
  backendSortField?: string;
}

export interface RowMapperConfig<T> {
  field: keyof T | string;
  isTemplate?: boolean;
}
