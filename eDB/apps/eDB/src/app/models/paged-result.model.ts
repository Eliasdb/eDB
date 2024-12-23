export interface PaginatedResponse<T> {
  currentPage: number;
  data: T[];
  nextCursor: number | null; // Null if there are no more pages
  hasMore: boolean;
}
