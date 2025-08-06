// models/sort-event.model.ts
export interface SortParams {
  sortField: string;
  sortDirection: 'asc' | 'desc';
}

export interface SortEvent {
  sortField: string;
  sortDirection: 'asc' | 'desc';
}
