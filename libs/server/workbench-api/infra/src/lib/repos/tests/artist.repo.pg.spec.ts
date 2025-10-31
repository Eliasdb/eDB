import { sql } from 'drizzle-orm';
import { beforeEach, describe, expect, it } from 'vitest';

import { db } from '../../db/drizzle';
import { ArtistRepoPg } from '../../repos/artist.repo.pg';
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

describe.sequential('ArtistRepoPg (infra ↔ db)', () => {
  beforeEach(async () => {
    await db.execute(sql`DELETE FROM "artists";`);
  });

  it('create/get/update/delete basic flow', async () => {
    const row1 = await ArtistRepoPg.create({
      name: 'name-1-zz',
      country: undefined,
      status: 'active',
      formedAt: undefined,
      website: undefined,
      externalId: randomUUID(),
    });
    expect(row1.id).toBeTruthy();

    const fetched = await ArtistRepoPg.getById(row1.id);
    expect(fetched?.id).toBe(row1.id);

    const patched = await ArtistRepoPg.update(row1.id, {});
    expect(patched?.id).toBe(row1.id);

    const ok = await ArtistRepoPg.delete(row1.id);
    expect(ok).toBe(true);

    const missing = await ArtistRepoPg.getById(row1.id);
    expect(missing).toBeUndefined();
  });

  it('list(): pagination + search/filter/sort (when applicable)', async () => {
    const row1 = await ArtistRepoPg.create({
      name: 'name-1-zz',
      country: undefined,
      status: 'active',
      formedAt: undefined,
      website: undefined,
      externalId: randomUUID(),
    });
    const row2 = await ArtistRepoPg.create({
      name: 'name-2-zz',
      country: undefined,
      status: 'active',
      formedAt: undefined,
      website: undefined,
      externalId: randomUUID(),
    });
    const row3 = await ArtistRepoPg.create({
      name: 'name-3-zz',
      country: undefined,
      status: 'active',
      formedAt: undefined,
      website: undefined,
      externalId: randomUUID(),
    });

    // PAGINATION smoke
    {
      const { rows, total } = await ArtistRepoPg.list({
        plan: plan({ limit: 1, pageSize: 1 }),
      });
      expect(rows.length).toBe(1);
      expect(total).toBeGreaterThanOrEqual(3);
    }

    // SEARCH: should match only "name" containing 'zz'
    {
      const { rows, total } = await ArtistRepoPg.list({
        plan: plan(),
        search: 'zz',
      });
      expect(total).toBeGreaterThanOrEqual(1);
      expect(rows.some((r) => r.name.toLowerCase().includes('zz'))).toBe(true);
    }

    // FILTER: by 1 field
    {
      const { rows, total } = await ArtistRepoPg.list({
        plan: plan({
          filters: {
            status: row1.status,
          },
        }),
      });
      expect(total).toBeGreaterThanOrEqual(1);
      expect(rows.some((r) => r.id === row1.id)).toBe(true);
    }

    // SORT: by name desc, check consistent desc order
    {
      const { rows } = await ArtistRepoPg.list({
        plan: plan({
          sorters: [{ field: 'name', dir: 'desc' }],
          limit: 10,
          offset: 0,
        }),
      });
      const proj = rows.map((r) => r.name);
      const copy = [...proj].sort((a, b) => (a > b ? -1 : a < b ? 1 : 0));
      expect(proj).toEqual(copy);
    }
  });
});
