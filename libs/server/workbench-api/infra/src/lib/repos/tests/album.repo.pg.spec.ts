import { sql } from 'drizzle-orm';
import { beforeEach, describe, expect, it } from 'vitest';

import { db } from '../../db/drizzle';
import { AlbumRepoPg } from '../../repos/album.repo.pg';
import { randomUUID } from 'node:crypto';

import type { PaginationPlan } from '@edb-workbench/api/shared';

function plan(overrides: Partial<PaginationPlan> = {}): PaginationPlan {
  return {
    page: 1,
    pageSize: 10,
    offset: 0,
    limit: 10,
    sorters: [],
    filters: {},
    ...overrides,
  };
}

describe.sequential('AlbumRepoPg (infra ↔ db)', () => {
  beforeEach(async () => {
    await db.execute(sql`DELETE FROM "albums";`);
  });

  it('create/get/update/delete basic flow', async () => {
    const row1 = await AlbumRepoPg.create({
      title: 'name-1-zz',
      authorId: randomUUID(),
      status: 'draft',
      publishedYear: undefined,
    });
    expect(row1.id).toBeTruthy();

    const fetched = await AlbumRepoPg.getById(row1.id);
    expect(fetched?.id).toBe(row1.id);

    const patched = await AlbumRepoPg.update(row1.id, {});
    expect(patched?.id).toBe(row1.id);

    const ok = await AlbumRepoPg.delete(row1.id);
    expect(ok).toBe(true);

    const missing = await AlbumRepoPg.getById(row1.id);
    expect(missing).toBeUndefined();
  });

  it('list(): pagination + search/filter/sort (when applicable)', async () => {
    const row1 = await AlbumRepoPg.create({
      title: 'name-1-zz',
      authorId: randomUUID(),
      status: 'draft',
      publishedYear: undefined,
    });
    const row2 = await AlbumRepoPg.create({
      title: 'name-2-zz',
      authorId: randomUUID(),
      status: 'draft',
      publishedYear: undefined,
    });
    const row3 = await AlbumRepoPg.create({
      title: 'name-3-zz',
      authorId: randomUUID(),
      status: 'draft',
      publishedYear: undefined,
    });

    // PAGINATION smoke
    {
      const { rows, total } = await AlbumRepoPg.list({
        plan: plan({ limit: 1, pageSize: 1 }),
      });
      expect(rows.length).toBe(1);
      expect(total).toBeGreaterThanOrEqual(3);
    }

    // SEARCH: should match only "title" containing 'zz'
    {
      const { rows, total } = await AlbumRepoPg.list({
        plan: plan(),
        search: 'zz',
      });
      expect(total).toBeGreaterThanOrEqual(1);
      expect(rows.some((r) => r.title.toLowerCase().includes('zz'))).toBe(true);
    }

    // FILTER: by 1 field
    {
      const { rows, total } = await AlbumRepoPg.list({
        plan: plan({
          filters: {
            status: row1.status,
          },
        }),
      });
      expect(total).toBeGreaterThanOrEqual(1);
      expect(rows.some((r) => r.id === row1.id)).toBe(true);
    }

    // SORT: by title desc, check consistent desc order
    {
      const { rows } = await AlbumRepoPg.list({
        plan: plan({
          sorters: [{ field: 'title', dir: 'desc' }],
          limit: 10,
          offset: 0,
        }),
      });
      const proj = rows.map((r) => r.title);
      const copy = [...proj].sort((a, b) => (a > b ? -1 : a < b ? 1 : 0));
      expect(proj).toEqual(copy);
    }
  });
});
