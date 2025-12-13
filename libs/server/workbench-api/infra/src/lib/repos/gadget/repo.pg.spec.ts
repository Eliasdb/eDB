import { sql } from 'drizzle-orm';
import { beforeEach, describe, expect, it } from 'vitest';

import { db } from '../../db/orm/drizzle';
import { GadgetRepoPg } from './repo.pg';

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

describe.sequential('GadgetRepoPg (infra ↔ db)', () => {
  beforeEach(async () => {
    await db.execute(sql`DELETE FROM "gadgets";`);
  });

  it('create/get/update/delete basic flow', async () => {
    const row1 = await GadgetRepoPg.create({
      name: 'name-1-zz',
      category: 'surveillance',
      weightGr: undefined,
      discontinued: undefined,
      releasedAt: undefined,
    });
    expect(row1.id).toBeTruthy();

    const fetched = await GadgetRepoPg.getById(row1.id);
    expect(fetched?.id).toBe(row1.id);

    const patched = await GadgetRepoPg.update(row1.id, {});
    expect(patched?.id).toBe(row1.id);

    const ok = await GadgetRepoPg.delete(row1.id);
    expect(ok).toBe(true);

    const missing = await GadgetRepoPg.getById(row1.id);
    expect(missing).toBeUndefined();
  });

  it('list(): pagination + search/filter/sort (when applicable)', async () => {
    const row1 = await GadgetRepoPg.create({
      name: 'name-1-zz',
      category: 'surveillance',
      weightGr: undefined,
      discontinued: undefined,
      releasedAt: undefined,
    });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const row2 = await GadgetRepoPg.create({
      name: 'name-2-zz',
      category: 'surveillance',
      weightGr: undefined,
      discontinued: undefined,
      releasedAt: undefined,
    });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const row3 = await GadgetRepoPg.create({
      name: 'name-3-zz',
      category: 'surveillance',
      weightGr: undefined,
      discontinued: undefined,
      releasedAt: undefined,
    });

    // PAGINATION smoke
    {
      const { rows, total } = await GadgetRepoPg.list({
        plan: plan({ limit: 1, pageSize: 1 }),
      });
      expect(rows.length).toBe(1);
      expect(total).toBeGreaterThanOrEqual(3);
    }

    // SEARCH: should match only "name" containing 'zz'
    {
      const { rows, total } = await GadgetRepoPg.list({
        plan: plan(),
        search: 'zz',
      });
      expect(total).toBeGreaterThanOrEqual(1);
      expect(rows.some((r) => r.name.toLowerCase().includes('zz'))).toBe(true);
    }

    // FILTER: by 1 field
    {
      const { rows, total } = await GadgetRepoPg.list({
        plan: plan({
          filters: {
            category: row1.category,
          },
        }),
      });
      expect(total).toBeGreaterThanOrEqual(1);
      expect(rows.some((r) => r.id === row1.id)).toBe(true);
    }

    // SORT: by name desc, check consistent desc order
    {
      const { rows } = await GadgetRepoPg.list({
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
