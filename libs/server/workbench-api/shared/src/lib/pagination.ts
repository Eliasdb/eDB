import { z } from 'zod';

/**
 * Query schema for list endpoints.
 *
 * - page / pageSize: slice the collection (1-based).
 * - sort: "field:dir,...", e.g. "createdAt:desc,name:asc".
 * - filter: "key=value,key2=value2". Each key is repo-specific (e.g. "status=active" or "agentId=...").
 * - search: free text. Repos decide which columns participate.
 * - include: comma-separated relation aliases to embed in results, e.g. "artist,agent".
 *   Unknown aliases are ignored safely. For list endpoints, included objects appear per item
 *   under their alias. For single-record endpoints, the include object is attached to the root record.
 */
export const listQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
  sort: z.string().optional(),
  filter: z.string().optional(),
  search: z.string().optional(),
  include: z.string().optional(), // optional by default, shared for all resources
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
