import { sql } from 'drizzle-orm';
import { beforeEach, describe, expect, it } from 'vitest';

import { db } from '../db/drizzle';
import { TagRepoPg } from './tag.repo.pg';

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

describe.sequential('TagRepoPg (infra ↔ db)', () => {
  beforeEach(async () => {
    await db.execute(sql`DELETE FROM "book_tags";`);
    await db.execute(sql`DELETE FROM "tags";`);
  });

  it('create() inserts a tag and getById() retrieves it', async () => {
    const tag = await TagRepoPg.create({ label: 'fantasy' });
    const found = await TagRepoPg.getById(tag.id);

    expect(found?.label).toBe('fantasy');
    expect(found?.id).toBe(tag.id);
  });

  it('update() changes the label and updatedAt', async () => {
    const tag = await TagRepoPg.create({ label: 'sci-fi' });
    const updated = await TagRepoPg.update(tag.id, {
      label: 'science-fiction',
    });

    expect(updated?.label).toBe('science-fiction');
    expect(updated?.updatedAt).not.toBe(tag.updatedAt);
  });

  it('delete() removes a tag', async () => {
    const tag = await TagRepoPg.create({ label: 'deleted' });
    const ok = await TagRepoPg.delete(tag.id);
    const after = await TagRepoPg.getById(tag.id);

    expect(ok).toBe(true);
    expect(after).toBeUndefined();
  });

  it('list() supports search, filters, pagination', async () => {
    await TagRepoPg.create({ label: 'fiction' });
    await TagRepoPg.create({ label: 'non-fiction' });
    await TagRepoPg.create({ label: 'drama' });

    const { rows, total } = await TagRepoPg.list({
      plan: plan(),
      search: 'fiction',
      filter: undefined,
    });

    expect(rows.length).toBeGreaterThan(0);
    expect(total).toBeGreaterThan(0);
    expect(rows.some((r) => r.label.includes('fiction'))).toBe(true);
  });
});
