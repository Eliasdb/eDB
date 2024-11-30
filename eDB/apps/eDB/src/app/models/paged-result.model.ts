export interface PaginatedResponse<T> {
  CurrentPage: number;
  data: T[];
  nextCursor: number | null; // Null if there are no more pages
  hasMore: boolean;
}
