import { sql } from 'drizzle-orm';
import { beforeEach, describe, expect, it } from 'vitest';

import { randomUUID } from 'node:crypto';
import { db } from '../../db/drizzle';
import { MissionRepoPg } from '../../repos/mission.repo.pg';

import type { PaginationPlan } from '@edb-workbench/api/shared';

let agentId: string;

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

describe.sequential('MissionRepoPg (infra ↔ db)', () => {
  beforeEach(async () => {
    // @edb begin:seed-parent agents
    agentId = randomUUID();
    await db.execute(sql`DELETE FROM "agents";`);
    await db.execute(
      sql`INSERT INTO "agents" ("id", "codename", "status") VALUES (${agentId}, ${'test-name'}, ${'active'})`,
    );
    // @edb end:seed-parent
    await db.execute(sql`DELETE FROM "missions";`);
  });

  it('create/get/update/delete basic flow', async () => {
    const row1 = await MissionRepoPg.create({
      title: 'name-1-zz',
      agentId: agentId,
      status: 'planned',
      riskLevel: undefined,
      eta: undefined,
    });
    expect(row1.id).toBeTruthy();

    const fetched = await MissionRepoPg.getById(row1.id);
    expect(fetched?.id).toBe(row1.id);

    const patched = await MissionRepoPg.update(row1.id, {});
    expect(patched?.id).toBe(row1.id);

    const ok = await MissionRepoPg.delete(row1.id);
    expect(ok).toBe(true);

    const missing = await MissionRepoPg.getById(row1.id);
    expect(missing).toBeUndefined();
  });

  it('list(): pagination + search/filter/sort (when applicable)', async () => {
    const row1 = await MissionRepoPg.create({
      title: 'name-1-zz',
      agentId: agentId,
      status: 'planned',
      riskLevel: undefined,
      eta: undefined,
    });
    const row2 = await MissionRepoPg.create({
      title: 'name-2-zz',
      agentId: agentId,
      status: 'planned',
      riskLevel: undefined,
      eta: undefined,
    });
    const row3 = await MissionRepoPg.create({
      title: 'name-3-zz',
      agentId: agentId,
      status: 'planned',
      riskLevel: undefined,
      eta: undefined,
    });

    // PAGINATION smoke
    {
      const { rows, total } = await MissionRepoPg.list({
        plan: plan({ limit: 1, pageSize: 1 }),
      });
      expect(rows.length).toBe(1);
      expect(total).toBeGreaterThanOrEqual(3);
    }

    // SEARCH: should match only "title" containing 'zz'
    {
      const { rows, total } = await MissionRepoPg.list({
        plan: plan(),
        search: 'zz',
      });
      expect(total).toBeGreaterThanOrEqual(1);
      expect(rows.some((r) => r.title.toLowerCase().includes('zz'))).toBe(true);
    }

    // FILTER: by 1 field
    {
      const { rows, total } = await MissionRepoPg.list({
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
      const { rows } = await MissionRepoPg.list({
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
