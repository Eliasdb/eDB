import { sql } from 'drizzle-orm';
import { beforeEach, describe, expect, it } from 'vitest';

import { AuthorRepoPg } from './author.repo.pg';

import type { PaginationPlan } from '@edb-workbench/api/shared';
import { db } from '../../db/orm/drizzle';

// small helper so we don't repeat PaginationPlan objects inline
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

describe.sequential('AuthorRepoPg (infra ↔ db)', () => {
  beforeEach(async () => {
    // try to start each test with a clean slate
    // but don't hard-fail if the table isn't created yet
    try {
      await db.execute(sql`DELETE FROM "authors";`);
    } catch (err) {
      // swallow "relation does not exist" so local dev can run tests
      // before running the migration
      // (once you run the CREATE TABLE migration, this won't trigger)
    }
  });

  it('create() inserts and getById() retrieves', async () => {
    // create
    const created = await AuthorRepoPg.create({
      firstName: 'Ada',
      lastName: 'Lovelace',
      bio: 'Computing pioneer',
      isActive: true,
    });

    expect(created.id).toBeTruthy();
    expect(created.firstName).toBe('Ada');
    expect(created.lastName).toBe('Lovelace');
    expect(created.isActive).toBe(true);
    expect(created.createdAt).toBeTypeOf('string');
    expect(created.updatedAt).toBeTypeOf('string');

    // read it back
    const fetched = await AuthorRepoPg.getById(created.id);
    expect(fetched).toBeTruthy();
    expect(fetched?.firstName).toBe('Ada');
    expect(fetched?.lastName).toBe('Lovelace');
    expect(fetched?.bio).toBe('Computing pioneer');
  });

  it('update() patches mutable fields', async () => {
    // seed row
    const created = await AuthorRepoPg.create({
      firstName: 'Alan',
      lastName: 'Turing',
      bio: 'Codebreaker',
      isActive: true,
    });

    // patch some stuff
    const updated = await AuthorRepoPg.update(created.id, {
      bio: 'Mathematician & codebreaker',
      isActive: false,
    });

    expect(updated).toBeTruthy();
    expect(updated?.bio).toBe('Mathematician & codebreaker');
    expect(updated?.isActive).toBe(false);

    // confirm DB really changed
    const fetched = await AuthorRepoPg.getById(created.id);
    expect(fetched?.bio).toBe('Mathematician & codebreaker');
    expect(fetched?.isActive).toBe(false);
  });

  it('delete() removes row and getById() returns undefined', async () => {
    const created = await AuthorRepoPg.create({
      firstName: 'Grace',
      lastName: 'Hopper',
      bio: 'COBOL legend',
      isActive: true,
    });

    const ok = await AuthorRepoPg.delete(created.id);
    expect(ok).toBe(true);

    const fetched = await AuthorRepoPg.getById(created.id);
    expect(fetched).toBeUndefined();
  });

  it('list() returns paginated data and total', async () => {
    // seed 3 authors that WE own
    const mine: string[] = [];

    for (const s of [
      { firstName: 'Zelda', lastName: 'Zimmer', bio: 'Bio 1', isActive: true },
      { firstName: 'Alice', lastName: 'Anders', bio: 'Bio 2', isActive: true },
      { firstName: 'Bob', lastName: 'Barker', bio: 'Bio 3', isActive: false },
    ]) {
      const created = await AuthorRepoPg.create(s);
      mine.push(created.id);
    }

    // ask for page 1 size 2
    const { rows, total } = await AuthorRepoPg.list({
      plan: plan({ page: 1, pageSize: 2, offset: 0, limit: 2 }),
      search: undefined,
      filter: undefined,
    });

    // total should be >= #we inserted (because other tests might have left stuff)
    expect(total).toBeGreaterThanOrEqual(mine.length);

    // we at least got some authors back
    expect(rows.length).toBeGreaterThan(0);

    // sanity check shape of *the first row returned*
    expect(rows[0]).toHaveProperty('firstName');
    expect(rows[0]).toHaveProperty('lastName');
    expect(rows[0]).toHaveProperty('createdAt');

    // make sure at least one of OUR inserted authors is in this page slice
    const returnedIds = rows.map((r) => r.id);
    const overlap = returnedIds.filter((id) => mine.includes(id));
    expect(overlap.length).toBeGreaterThan(0);
  });

  it('list() supports free-text search (firstName/lastName)', async () => {
    await AuthorRepoPg.create({
      firstName: 'Brandon',
      lastName: 'Sanderson',
      bio: 'Epic fantasy author',
      isActive: true,
    });
    await AuthorRepoPg.create({
      firstName: 'Haruki',
      lastName: 'Murakami',
      bio: 'Magic realism',
      isActive: true,
    });

    // search "br" should match Brandon Sanderson only
    const { rows, total } = await AuthorRepoPg.list({
      plan: plan(),
      search: 'br',
      filter: undefined,
    });

    expect(total).toBe(1);
    expect(rows.length).toBe(1);
    expect(rows[0].firstName).toBe('Brandon');
  });

  it('list() supports boolean + exact match filters', async () => {
    // 2 active, 1 inactive
    await AuthorRepoPg.create({
      firstName: 'ActiveOne',
      lastName: 'Writer',
      isActive: true,
      bio: 'A1',
    });
    await AuthorRepoPg.create({
      firstName: 'ActiveTwo',
      lastName: 'Writer',
      isActive: true,
      bio: 'A2',
    });
    await AuthorRepoPg.create({
      firstName: 'InactiveGuy',
      lastName: 'Writer',
      isActive: false,
      bio: 'B1',
    });

    // filter isActive=false
    const { rows, total } = await AuthorRepoPg.list({
      plan: plan({ filters: { isActive: 'false' } }),
      search: undefined,
      filter: undefined,
    });

    expect(total).toBe(1);
    expect(rows.length).toBe(1);
    expect(rows[0].firstName).toBe('InactiveGuy');
    expect(rows[0].isActive).toBe(false);
  });

  it('list() respects simple sorting (firstName asc / desc)', async () => {
    // insert out of order
    const a = await AuthorRepoPg.create({
      firstName: 'Charlie',
      lastName: 'Zulu',
      bio: '',
      isActive: true,
    });
    const b = await AuthorRepoPg.create({
      firstName: 'Alice',
      lastName: 'Alpha',
      bio: '',
      isActive: true,
    });
    const c = await AuthorRepoPg.create({
      firstName: 'Bob',
      lastName: 'Beta',
      bio: '',
      isActive: true,
    });

    // ASC
    const ascRes = await AuthorRepoPg.list({
      plan: plan({
        sorters: [{ field: 'firstName', dir: 'asc' }],
        offset: 0,
        limit: 50,
      }),
      search: undefined,
      filter: undefined,
    });

    // Grab ONLY the authors we just created
    const ascMine = ascRes.rows
      .filter((r) => [a.id, b.id, c.id].includes(r.id))
      .map((r) => r.firstName);

    // Check they are sorted ascending
    const ascSortedCopy = [...ascMine].sort((x, y) => x.localeCompare(y, 'en'));
    expect(ascMine).toEqual(ascSortedCopy);

    // DESC
    const descRes = await AuthorRepoPg.list({
      plan: plan({
        sorters: [{ field: 'firstName', dir: 'desc' }],
        offset: 0,
        limit: 50,
      }),
      search: undefined,
      filter: undefined,
    });

    const descMine = descRes.rows
      .filter((r) => [a.id, b.id, c.id].includes(r.id))
      .map((r) => r.firstName);

    const descSortedCopy = [...descMine].sort((x, y) =>
      y.localeCompare(x, 'en'),
    );
    expect(descMine).toEqual(descSortedCopy);
  });
});
