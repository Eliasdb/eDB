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
export declare const listQuerySchema: z.ZodObject<{
    page: z.ZodDefault<z.ZodNumber>;
    pageSize: z.ZodDefault<z.ZodNumber>;
    sort: z.ZodOptional<z.ZodString>;
    filter: z.ZodOptional<z.ZodString>;
    search: z.ZodOptional<z.ZodString>;
    include: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    page: number;
    pageSize: number;
    sort?: string | undefined;
    filter?: string | undefined;
    search?: string | undefined;
    include?: string | undefined;
}, {
    sort?: string | undefined;
    filter?: string | undefined;
    search?: string | undefined;
    page?: number | undefined;
    pageSize?: number | undefined;
    include?: string | undefined;
}>;
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
    sorters: {
        field: string;
        dir: 'asc' | 'desc';
    }[];
    filters: Record<string, string>;
};
export declare function buildPagination(query: ListQueryInput): PaginationPlan;
/**
 * Standard paginated API response shape.
 * All list endpoints should return this.
 */
export type PaginatedResult<T> = {
    items: T[];
    page: number;
    pageSize: number;
    total: number;
    hasMore: boolean;
    nextPage: number | null;
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
export declare function makePaginatedResult<T>(rows: T[], plan: PaginationPlan, // has page & pageSize
total: number): PaginatedResult<T>;
