import { and, eq, sql } from 'drizzle-orm';
import { db } from '../db/drizzle';
import { bookTagsTable } from '../db/schema.bookTags';
import { booksTable } from '../db/schema.books';
import { tagsTable } from '../db/schema.tags';

export interface BookTagLink {
  bookId: string;
  tagId: string;
  createdAt: string;
}

export const BookTagRepoPg = {
  async link(bookId: string, tagId: string): Promise<BookTagLink> {
    const inserted = await db
      .insert(bookTagsTable)
      .values({ bookId, tagId, created_at: sql`now()` })
      .onConflictDoNothing() // idempotent link
      .returning();

    // drizzle returns [] if conflict
    const row =
      inserted[0] ??
      (await db.query.bookTagsTable.findFirst({
        where: (bt, { eq }) => eq(bt.bookId, bookId) && eq(bt.tagId, tagId),
      }));

    return {
      bookId: row.bookId,
      tagId: row.tagId,
      createdAt: row.created_at.toISOString(),
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

  async listTagsForBook(bookId: string) {
    const rows = await db
      .select({
        id: tagsTable.id,
        label: tagsTable.label,
        createdAt: tagsTable.created_at,
      })
      .from(bookTagsTable)
      .innerJoin(tagsTable, eq(bookTagsTable.tagId, tagsTable.id))
      .where(eq(bookTagsTable.bookId, bookId));

    return rows.map((r) => ({
      id: r.id,
      label: r.label,
      createdAt: r.createdAt.toISOString(),
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

    return rows;
  },
};
