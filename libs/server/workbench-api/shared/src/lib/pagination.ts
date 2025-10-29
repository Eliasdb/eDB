import { z } from 'zod';

/**
 * The query shape we accept on list endpoints.
 * page / pageSize control slice
 * sort e.g. "name:asc,createdAt:desc"
 * filter e.g. "status=active,type=internal"
 */

export const listQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
  sort: z.string().optional(),
  filter: z.string().optional(),
  search: z.string().optional(), // <-- add this
});

export type ListQueryInput = z.infer<typeof listQuerySchema>;

/**
 * Normalized pagination/filter/sort instructions.
 * This is what repo/service uses to decide what to fetch.
 */
export type PaginationPlan = {
  page: number;
  pageSize: number;
  offset: number;
  limit: number;
  sorters: { field: string; dir: 'asc' | 'desc' }[];
  filters: Record<string, string>;
};

export function buildPagination(query: ListQueryInput): PaginationPlan {
  const page = query.page ?? 1;
  const pageSize = query.pageSize ?? 20;

  const offset = (page - 1) * pageSize;
  const limit = pageSize;

  // explicitly type the mapped result so TS knows dir is 'asc' | 'desc'
  const sorters: PaginationPlan['sorters'] = (query.sort ?? '')
    .split(',')
    .filter(Boolean)
    .map((pair) => {
      const [field, dirRaw] = pair.split(':');
      const dir = dirRaw === 'desc' ? 'desc' : 'asc';
      return { field, dir };
    });

  const filters: Record<string, string> = {};
  (query.filter ?? '')
    .split(',')
    .filter(Boolean)
    .forEach((pair) => {
      const [key, value] = pair.split('=');
      if (key && value) {
        filters[key] = value;
      }
    });

  return {
    page,
    pageSize,
    offset,
    limit,
    sorters,
    filters,
  };
}

/**
 * Standard paginated API response shape.
 * All list endpoints should return this.
 */
export type PaginatedResult<T> = {
  items: T[];
  page: number;
  pageSize: number;
  total: number;
  hasMore: boolean; // <-- new
  nextPage: number | null; // <-- new
};

/**
 * Build the final payload returned by the service/controller.
 *
 * rows: the current page of items (already sliced/filtered)
 * plan: the PaginationPlan that came from buildPagination()
 * total: total number of matching rows BEFORE slicing
 *
 * This lets the frontend know how many pages exist.
 */
export function makePaginatedResult<T>(
  rows: T[],
  plan: PaginationPlan, // has page & pageSize
  total: number,
): PaginatedResult<T> {
  const { page, pageSize } = plan;

  // how many pages are possible in total?
  // maxPages = ceil(total / pageSize)
  const maxPagesRaw = total / pageSize;
  const maxPages = Number.isInteger(maxPagesRaw)
    ? maxPagesRaw
    : Math.floor(maxPagesRaw) + 1;

  const hasMore = page < maxPages;
  const nextPage = hasMore ? page + 1 : null;

  return {
    items: rows,
    page,
    pageSize,
    total,
    hasMore,
    nextPage,
  };
}
