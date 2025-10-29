// libs/server/workbench-api/infra/src/repos/bookTag.repo.pg.ts
import { and, eq, sql } from 'drizzle-orm';
import { db } from '../db/drizzle';
import { bookTagsTable } from '../db/schema.bookTags';
import { booksTable } from '../db/schema.books';
import { tagsTable } from '../db/schema.tags';

import type { BookTagRepo, Tag } from '@edb-workbench/api/models';

// Optional convenience type used by your helpers
export interface BookTagLink {
  bookId: string;
  tagId: string;
  createdAt: string;
}

/** ---- Core part: exactly the interface your resources expect ---- */
const core: BookTagRepo = {
  async attachTagToBook(bookId: string, tagId: string): Promise<void> {
    await db
      .insert(bookTagsTable)
      .values({ bookId, tagId, created_at: sql`now()` })
      .onConflictDoNothing({
        target: [bookTagsTable.bookId, bookTagsTable.tagId],
      });
  },

  async detachTagFromBook(bookId: string, tagId: string): Promise<void> {
    await db
      .delete(bookTagsTable)
      .where(
        and(eq(bookTagsTable.bookId, bookId), eq(bookTagsTable.tagId, tagId)),
      );
  },
};

/** ---- Extras: you can keep using these, they won’t affect automation ---- */
type Extras = {
  link(bookId: string, tagId: string): Promise<BookTagLink>;
  unlink(bookId: string, tagId: string): Promise<boolean>;
  listTagsForBook(bookId: string): Promise<Tag[]>;
  listBooksForTag(
    tagId: string,
  ): Promise<
    {
      id: string;
      title: string;
      publishedYear: number | null;
      status: 'draft' | 'published' | 'archived';
    }[]
  >;
};

export const BookTagRepoPg: BookTagRepo & Extras = Object.assign({}, core, {
  async link(bookId: string, tagId: string): Promise<BookTagLink> {
    const inserted = await db
      .insert(bookTagsTable)
      .values({ bookId, tagId, created_at: sql`now()` })
      .onConflictDoNothing()
      .returning();

    // If conflict, fetch existing link
    const row =
      inserted[0] ??
      (await db.query.bookTagsTable.findFirst({
        where: (bt, { eq }) => and(eq(bt.bookId, bookId), eq(bt.tagId, tagId)),
      }));

    return {
      bookId: row!.bookId,
      tagId: row!.tagId,
      createdAt: row!.created_at.toISOString(),
    };
  },

  async unlink(bookId: string, tagId: string): Promise<boolean> {
    const deleted = await db
      .delete(bookTagsTable)
      .where(
        and(eq(bookTagsTable.bookId, bookId), eq(bookTagsTable.tagId, tagId)),
      )
      .returning({ bookId: bookTagsTable.bookId });
    return deleted.length > 0;
  },

  async listTagsForBook(bookId: string): Promise<Tag[]> {
    const rows = await db
      .select({
        id: tagsTable.id,
        label: tagsTable.label,
        created_at: tagsTable.created_at,
        updated_at: tagsTable.updated_at, // include updatedAt to satisfy Tag
      })
      .from(bookTagsTable)
      .innerJoin(tagsTable, eq(bookTagsTable.tagId, tagsTable.id))
      .where(eq(bookTagsTable.bookId, bookId));

    return rows.map((r) => ({
      id: r.id,
      label: r.label,
      createdAt: r.created_at.toISOString(),
      updatedAt: r.updated_at.toISOString(),
    }));
  },

  async listBooksForTag(tagId: string) {
    const rows = await db
      .select({
        id: booksTable.id,
        title: booksTable.title,
        publishedYear: booksTable.publishedYear,
        status: booksTable.status,
      })
      .from(bookTagsTable)
      .innerJoin(booksTable, eq(bookTagsTable.bookId, booksTable.id))
      .where(eq(bookTagsTable.tagId, tagId));

    // return a light summary type on purpose (not the full Book contract)
    return rows.map((r) => ({
      id: r.id,
      title: r.title,
      publishedYear: r.publishedYear,
      status: r.status as 'draft' | 'published' | 'archived',
    }));
  },
});
