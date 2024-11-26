export interface PagedResult<T> {
  items: T[];
  hasMore: boolean;
  pageNumber: number;
  pageSize: number;
  totalCount: number; // Optional: Total number of items
}
