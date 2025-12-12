import { sql } from 'drizzle-orm';
import { beforeEach, describe, expect, it } from 'vitest';

import { db } from '../../db/orm/drizzle';
import { tagsTable } from '../../db/schemas/examples/schema.tags';
import { AuthorRepoPg } from './author.repo.pg';
import { BookRepoPg } from './book.repo.pg';
import { BookTagRepoPg } from './bookTag.repo.pg';

describe.sequential('BookTagRepoPg (infra ↔ db)', () => {
  beforeEach(async () => {
    await db.execute(sql`DELETE FROM "book_tags";`);
    await db.execute(sql`DELETE FROM "books";`);
    await db.execute(sql`DELETE FROM "tags";`);
    await db.execute(sql`DELETE FROM "authors";`);
  });

  it('link() inserts and listTagsForBook() retrieves', async () => {
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

    const tag1 = (
      await db
        .insert(tagsTable)
        .values({
          label: 'satire',
          created_at: sql`now()`,
          updated_at: sql`now()`,
        })
        .returning()
    )[0];

    const tag2 = (
      await db
        .insert(tagsTable)
        .values({
          label: 'philosophy',
          created_at: sql`now()`,
          updated_at: sql`now()`,
        })
        .returning()
    )[0];

    await BookTagRepoPg.link(book.id, tag1.id);
    await BookTagRepoPg.link(book.id, tag2.id);

    const tags = await BookTagRepoPg.listTagsForBook(book.id);
    const labels = tags.map((t) => t.label).sort();
    expect(labels).toEqual(['philosophy', 'satire']);
  });

  it('unlink() removes a tag relation', async () => {
    const author = await AuthorRepoPg.create({
      firstName: 'Neil',
      lastName: 'Gaiman',
      bio: 'Co-author',
      isActive: true,
    });

    const book = await BookRepoPg.create({
      authorId: author.id,
      title: 'Good Omens',
      publishedYear: 1990,
      status: 'published',
    });

    const tag = (
      await db
        .insert(tagsTable)
        .values({
          label: 'fantasy',
          created_at: sql`now()`,
          updated_at: sql`now()`,
        })
        .returning()
    )[0];

    await BookTagRepoPg.link(book.id, tag.id);
    let tags = await BookTagRepoPg.listTagsForBook(book.id);
    expect(tags.length).toBe(1);

    const ok = await BookTagRepoPg.unlink(book.id, tag.id);
    expect(ok).toBe(true);

    tags = await BookTagRepoPg.listTagsForBook(book.id);
    expect(tags.length).toBe(0);
  });

  it('listBooksForTag() finds books linked to a tag', async () => {
    const author = await AuthorRepoPg.create({
      firstName: 'Brandon',
      lastName: 'Sanderson',
      bio: 'Epic fantasy',
      isActive: true,
    });

    const book1 = await BookRepoPg.create({
      authorId: author.id,
      title: 'The Way of Kings',
      publishedYear: 2010,
      status: 'published',
    });

    const book2 = await BookRepoPg.create({
      authorId: author.id,
      title: 'Words of Radiance',
      publishedYear: 2014,
      status: 'published',
    });

    const tag = (
      await db
        .insert(tagsTable)
        .values({
          label: 'stormlight',
          created_at: sql`now()`,
          updated_at: sql`now()`,
        })
        .returning()
    )[0];

    await BookTagRepoPg.link(book1.id, tag.id);
    await BookTagRepoPg.link(book2.id, tag.id);

    const books = await BookTagRepoPg.listBooksForTag(tag.id);
    const titles = books.map((b) => b.title).sort();
    expect(titles).toEqual(['The Way of Kings', 'Words of Radiance']);
  });
});
