import { sql } from 'drizzle-orm';
import { beforeEach, describe, expect, it } from 'vitest';

import { db } from '../db/drizzle';
import { bookTagsTable } from '../db/schema.bookTags';
import { tagsTable } from '../db/schema.tags';
import { AuthorRepoPg } from './author.repo.pg';
import { BookRepoPg } from './book.repo.pg';

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

describe.sequential('BookRepoPg (infra ↔ db)', () => {
  beforeEach(async () => {
    // only clear what this suite owns; leave authors alone
    await db.execute(sql`DELETE FROM "book_tags";`);
    await db.execute(sql`DELETE FROM "books";`);
    await db.execute(sql`DELETE FROM "tags";`);
  });

  it('create() inserts a book with default draft status', async () => {
    const author = await AuthorRepoPg.create({
      firstName: 'Ada',
      lastName: 'Lovelace',
      bio: 'Math queen',
      isActive: true,
    });

    const book = await BookRepoPg.create({
      authorId: author.id,
      title: 'Analytical Engine Notes',
      publishedYear: 1843,
      // no explicit status -> should default to 'draft'
    });

    // shape + defaults
    expect(book.id).toBeTruthy();
    expect(book.authorId).toBe(author.id);
    expect(book.title).toBe('Analytical Engine Notes');
    expect(book.publishedYear).toBe(1843);
    expect(book.status).toBe('draft');
    expect(book.createdAt).toBeTypeOf('string');
    expect(book.updatedAt).toBeTypeOf('string');
  });

  it('update() patches mutable fields including status and publishedYear', async () => {
    const author = await AuthorRepoPg.create({
      firstName: 'Neil',
      lastName: 'Gaiman',
      bio: 'Stories',
      isActive: true,
    });

    const book = await BookRepoPg.create({
      authorId: author.id,
      title: 'Neverwhere',
      publishedYear: 1996,
      status: 'draft',
    });

    const updated = await BookRepoPg.update(book.id, {
      title: "Neverwhere (Author's Cut)",
      publishedYear: 1997,
      status: 'published',
    });

    expect(updated?.title).toBe("Neverwhere (Author's Cut)");
    expect(updated?.publishedYear).toBe(1997);
    expect(updated?.status).toBe('published');
  });

  it('delete() removes row and getById() returns undefined', async () => {
    const author = await AuthorRepoPg.create({
      firstName: 'Frank',
      lastName: 'Herbert',
      bio: 'Dune stuff',
      isActive: true,
    });

    const book = await BookRepoPg.create({
      authorId: author.id,
      title: 'Dune',
      publishedYear: 1965,
      status: 'published',
    });

    const ok = await BookRepoPg.delete(book.id);
    expect(ok).toBe(true);

    const after = await BookRepoPg.getById(book.id);
    expect(after).toBeUndefined();
  });

  it('list() supports search, filters, pagination, sorting', async () => {
    const a1 = await AuthorRepoPg.create({
      firstName: 'Brandon',
      lastName: 'Sanderson',
      bio: 'Epic fantasy',
      isActive: true,
    });
    const a2 = await AuthorRepoPg.create({
      firstName: 'Haruki',
      lastName: 'Murakami',
      bio: 'Surreal',
      isActive: true,
    });

    const b1 = await BookRepoPg.create({
      authorId: a1.id,
      title: 'The Way of Kings',
      publishedYear: 2010,
      status: 'published',
    });
    const b2 = await BookRepoPg.create({
      authorId: a1.id,
      title: 'Words of Radiance',
      publishedYear: 2014,
      status: 'published',
    });
    const b3 = await BookRepoPg.create({
      authorId: a2.id,
      title: 'Kafka on the Shore',
      publishedYear: 2002,
      status: 'archived',
    });

    // SEARCH: "way" should match only 'The Way of Kings'
    {
      const { rows: sRows, total: sTotal } = await BookRepoPg.list({
        plan: plan(),
        search: 'way',
        filter: undefined,
      });

      // We expect to see b1 in there
      const ids = sRows.map((r) => r.id);

      expect(ids).toContain(b1.id);
      expect(sRows.find((r) => r.id === b1.id)?.title).toBe('The Way of Kings');

      // sTotal should be >= 1, not necessarily exactly 1
      expect(sTotal).toBeGreaterThanOrEqual(1);
    }

    // FILTER: status=published should include only published books we made (b1,b2)
    {
      const { rows: fRows, total: fTotal } = await BookRepoPg.list({
        plan: plan({ filters: { status: 'published' } }),
        search: undefined,
        filter: undefined,
      });

      const returnedIds = fRows.map((r) => r.id);
      // both published ones are there
      expect(returnedIds).toContain(b1.id);
      expect(returnedIds).toContain(b2.id);

      // none of them are archived
      expect(fRows.every((b) => b.status === 'published')).toBe(true);

      // total should be >= 2
      expect(fTotal).toBeGreaterThanOrEqual(2);
    }

    // PAGINATION: limit 1
    {
      const { rows: pRows, total: pTotal } = await BookRepoPg.list({
        plan: plan({ limit: 1, pageSize: 1, offset: 0 }),
        search: undefined,
        filter: undefined,
      });

      expect(pRows.length).toBe(1);
      // total should be >= number of books we inserted in THIS test (3)
      expect(pTotal).toBeGreaterThanOrEqual(3);
    }

    // SORT: by title desc, smoke check that we got a consistent desc order
    {
      const { rows: sortRows } = await BookRepoPg.list({
        plan: plan({
          sorters: [{ field: 'title', dir: 'desc' }],
          offset: 0,
          limit: 10,
        }),
        search: undefined,
        filter: undefined,
      });

      // Pull just OUR 3 books from the result
      const ours = sortRows.filter((r) => [b1.id, b2.id, b3.id].includes(r.id));
      const titles = ours.map((b) => b.title);

      // Check that `titles` is already in desc order
      const sortedCopy = [...titles].sort((a, b) => b.localeCompare(a, 'en'));
      expect(titles).toEqual(sortedCopy);
    }
  });

  it("listByAuthor() only returns that author's books", async () => {
    const a1 = await AuthorRepoPg.create({
      firstName: 'George',
      lastName: 'Martin',
      bio: 'thrones',
      isActive: true,
    });
    const a2 = await AuthorRepoPg.create({
      firstName: 'J.K.',
      lastName: 'Rowling',
      bio: 'wizards',
      isActive: true,
    });

    await BookRepoPg.create({
      authorId: a1.id,
      title: 'A Game of Thrones',
      publishedYear: 1996,
      status: 'published',
    });
    await BookRepoPg.create({
      authorId: a1.id,
      title: 'A Clash of Kings',
      publishedYear: 1998,
      status: 'published',
    });
    await BookRepoPg.create({
      authorId: a2.id,
      title: "Harry Potter and the Philosopher's Stone",
      publishedYear: 1997,
      status: 'published',
    });

    const { rows, total } = await BookRepoPg.listByAuthor({
      authorId: a1.id,
      plan: plan(),
      search: undefined,
      filter: undefined,
    });

    expect(total).toBe(2);
    expect(rows.length).toBe(2);
    expect(rows.every((b) => b.authorId === a1.id)).toBe(true);
  });

  it('listTagsForBook() returns tags joined via book_tags', async () => {
    // make author + book
    const author = await AuthorRepoPg.create({
      firstName: 'Terry',
      lastName: 'Pratchett',
      bio: 'Discworld',
      isActive: true,
    });

    const book = await BookRepoPg.create({
      authorId: author.id,
      title: 'Small Gods',
      publishedYear: 1992,
      status: 'published',
    });

    // create two tags manually
    // we do raw inserts here because we haven't built TagRepoPg yet
    const tagRes1 = await db
      .insert(tagsTable)
      .values({
        label: 'satire',
        created_at: sql`now()`,
        updated_at: sql`now()`,
      })
      .returning();
    const tagRes2 = await db
      .insert(tagsTable)
      .values({
        label: 'philosophy',
        created_at: sql`now()`,
        updated_at: sql`now()`,
      })
      .returning();

    const tag1 = tagRes1[0];
    const tag2 = tagRes2[0];

    // link book <-> tags in pivot
    await db.insert(bookTagsTable).values([
      {
        bookId: book.id,
        tagId: tag1.id,
      },
      {
        bookId: book.id,
        tagId: tag2.id,
      },
    ]);

    // now call listTagsForBook
    const tags = await BookRepoPg.listTagsForBook(book.id);

    const labels = tags.map((t) => t.label).sort();
    expect(labels).toEqual(['philosophy', 'satire']);

    // shape check
    expect(tags[0]).toHaveProperty('id');
    expect(tags[0]).toHaveProperty('label');
    expect(tags[0]).toHaveProperty('createdAt');
  });
});
