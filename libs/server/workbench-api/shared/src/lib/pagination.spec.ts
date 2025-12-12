import { describe, expect, it } from 'vitest';
import { buildPagination, makePaginatedResult } from './pagination';

describe('pagination helpers', () => {
  it('buildPagination parses paging/sort/filter into a plan', () => {
    const plan = buildPagination({
      page: 2,
      pageSize: 10,
      sort: 'name:asc,createdAt:desc',
      filter: 'status=active,type=internal',
    });

    // paging math
    expect(plan.page).toBe(2);
    expect(plan.pageSize).toBe(10);
    expect(plan.offset).toBe(10); // (2 - 1) * 10
    expect(plan.limit).toBe(10);

    // sorters
    expect(plan.sorters).toEqual([
      { field: 'name', dir: 'asc' },
      { field: 'createdAt', dir: 'desc' },
    ]);

    // filters
    expect(plan.filters).toEqual({
      status: 'active',
      type: 'internal',
    });
  });

  it('makePaginatedResult builds canonical list response', () => {
    const plan = buildPagination({
      page: 3,
      pageSize: 5,
    });

    const rows = [
      { id: 'a', label: 'one' },
      { id: 'b', label: 'two' },
    ];

    const result = makePaginatedResult(rows, plan, 42);

    expect(result).toEqual({
      items: rows,
      page: 3,
      pageSize: 5,
      total: 42,
    });
  });
});
