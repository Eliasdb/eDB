import { sql } from 'drizzle-orm';
import { beforeEach, describe, expect, it } from 'vitest';

import { db } from '../../db/drizzle';
import { AgentRepoPg } from '../../repos/agent.repo.pg';
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

describe.sequential('AgentRepoPg (infra ↔ db)', () => {
  beforeEach(async () => {
    await db.execute(sql`DELETE FROM "agents";`);
  });

  it('create/get/update/delete basic flow', async () => {
    const row1 = await AgentRepoPg.create({
      codename: 'name-1-zz',
      status: 'active',
      clearance: undefined,
      specialty: undefined,
    });
    expect(row1.id).toBeTruthy();

    const fetched = await AgentRepoPg.getById(row1.id);
    expect(fetched?.id).toBe(row1.id);

    const patched = await AgentRepoPg.update(row1.id, {});
    expect(patched?.id).toBe(row1.id);

    const ok = await AgentRepoPg.delete(row1.id);
    expect(ok).toBe(true);

    const missing = await AgentRepoPg.getById(row1.id);
    expect(missing).toBeUndefined();
  });

  it('list(): pagination + search/filter/sort (when applicable)', async () => {
    const row1 = await AgentRepoPg.create({
      codename: 'name-1-zz',
      status: 'active',
      clearance: undefined,
      specialty: undefined,
    });
    const row2 = await AgentRepoPg.create({
      codename: 'name-2-zz',
      status: 'active',
      clearance: undefined,
      specialty: undefined,
    });
    const row3 = await AgentRepoPg.create({
      codename: 'name-3-zz',
      status: 'active',
      clearance: undefined,
      specialty: undefined,
    });

    // PAGINATION smoke
    {
      const { rows, total } = await AgentRepoPg.list({
        plan: plan({ limit: 1, pageSize: 1 }),
      });
      expect(rows.length).toBe(1);
      expect(total).toBeGreaterThanOrEqual(3);
    }

    // SEARCH: should match only "codename" containing 'zz'
    {
      const { rows, total } = await AgentRepoPg.list({
        plan: plan(),
        search: 'zz',
      });
      expect(total).toBeGreaterThanOrEqual(1);
      expect(rows.some((r) => r.codename.toLowerCase().includes('zz'))).toBe(
        true,
      );
    }

    // FILTER: by 1 field
    {
      const { rows, total } = await AgentRepoPg.list({
        plan: plan({
          filters: {
            status: row1.status,
          },
        }),
      });
      expect(total).toBeGreaterThanOrEqual(1);
      expect(rows.some((r) => r.id === row1.id)).toBe(true);
    }

    // SORT: by codename desc, check consistent desc order
    {
      const { rows } = await AgentRepoPg.list({
        plan: plan({
          sorters: [{ field: 'codename', dir: 'desc' }],
          limit: 10,
          offset: 0,
        }),
      });
      const proj = rows.map((r) => r.codename);
      const copy = [...proj].sort((a, b) => (a > b ? -1 : a < b ? 1 : 0));
      expect(proj).toEqual(copy);
    }
  });
});
