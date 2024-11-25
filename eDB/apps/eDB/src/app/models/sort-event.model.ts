// models/sort-event.model.ts
export interface SortEvent {
  sortField: string;
  sortDirection: 'asc' | 'desc';
}
