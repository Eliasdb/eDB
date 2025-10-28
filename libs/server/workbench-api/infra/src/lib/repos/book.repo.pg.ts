import { and, asc, desc, eq, like, sql, type AnyColumn } from 'drizzle-orm';

import { db } from '../db/drizzle';
import { booksTable } from '../db/schema.books';
import { bookTagsTable } from '../db/schema.bookTags';
import { tagsTable } from '../db/schema.tags';

import type { Book, BookRepo, Tag } from '@edb-workbench/api/models';
import type { PaginationPlan } from '@edb-workbench/api/shared';

// --- helpers -------------------------------------------------

// Shape we expect when selecting from booksTable
type BookRow = {
  id: string;
  authorId: string;
  title: string;
  publishedYear: number | null;
  status: string;
  created_at: Date;
  updated_at: Date;
};

// Shape we expect when selecting tags for a book
type TagRow = {
  id: string;
  label: string;
  created_at: Date;
  updated_at: Date;
};

function rowToBook(row: BookRow): Book {
  return {
    id: row.id,
    authorId: row.authorId,
    title: row.title,
    publishedYear:
      row.publishedYear === null || row.publishedYear === undefined
        ? undefined
        : row.publishedYear,
    status: row.status as Book['status'],
    createdAt: row.created_at.toISOString(),
    updatedAt: row.updated_at.toISOString(),
  };
}

function rowToTag(row: TagRow): Tag {
  return {
    id: row.id,
    label: row.label,
    createdAt: row.created_at.toISOString(),
    updatedAt: row.updated_at.toISOString(),
  };
}

// build WHERE for list()/listByAuthor() based on search/filter/etc
function buildWhere({
  search,
  mergedFilters,
  forceAuthorId,
}: {
  search?: string;
  mergedFilters: Record<string, string>;
  forceAuthorId?: string;
}) {
  const parts = [];

  // full-text-ish title search
  if (search && search.trim() !== '') {
    const q = `%${search.toLowerCase()}%`;
    parts.push(like(sql`lower(${booksTable.title})`, q));
  }

  // query filters & enforced filters (authorId)
  for (const [key, val] of Object.entries(mergedFilters)) {
    if (key === 'authorId') {
      parts.push(eq(booksTable.authorId, val));
    }
    if (key === 'status') {
      parts.push(eq(booksTable.status, val));
    }
    if (key === 'publishedYear') {
      const yr = Number(val);
      if (!Number.isNaN(yr)) {
        parts.push(eq(booksTable.publishedYear, yr));
      }
    }
    if (key === 'title') {
      parts.push(eq(booksTable.title, val));
    }
  }

  if (forceAuthorId) {
    parts.push(eq(booksTable.authorId, forceAuthorId));
  }

  return parts.length > 0 ? and(...parts) : undefined;
}

// choose ORDER BY column safely
function buildOrder(plan: PaginationPlan): {
  orderByExpr: AnyColumn;
  orderDir: 'asc' | 'desc';
} {
  let orderByExpr: AnyColumn = booksTable.created_at;
  let orderDir: 'asc' | 'desc' = 'asc';

  if (plan.sorters.length > 0) {
    const { field, dir } = plan.sorters[0];
    orderDir = dir;
    if (field === 'title') orderByExpr = booksTable.title;
    if (field === 'publishedYear') orderByExpr = booksTable.publishedYear;
    if (field === 'status') orderByExpr = booksTable.status;
    if (field === 'createdAt') orderByExpr = booksTable.created_at;
  }

  return { orderByExpr, orderDir };
}

// --- repo ----------------------------------------------------

export const BookRepoPg: BookRepo = {
  async list(args) {
    const { plan, search, filter } = args;
    const mergedFilters = { ...(plan.filters ?? {}), ...(filter ?? {}) };

    const whereExpr = buildWhere({
      search,
      mergedFilters,
    });

    const { orderByExpr, orderDir } = buildOrder(plan);

    const totalResult = await db
      .select({ cnt: sql<number>`count(*)::int` })
      .from(booksTable)
      .where(whereExpr);

    const total = totalResult[0]?.cnt ?? 0;

    const rowsDb = await db
      .select()
      .from(booksTable)
      .where(whereExpr)
      .orderBy(orderDir === 'asc' ? asc(orderByExpr) : desc(orderByExpr))
      .limit(plan.limit)
      .offset(plan.offset);

    return {
      rows: rowsDb.map(rowToBook),
      total,
    };
  },

  async listByAuthor(args) {
    const { authorId, plan, search, filter } = args;
    const mergedFilters = { ...(plan.filters ?? {}), ...(filter ?? {}) };

    const whereExpr = buildWhere({
      search,
      mergedFilters,
      forceAuthorId: authorId,
    });

    const { orderByExpr, orderDir } = buildOrder(plan);

    const totalResult = await db
      .select({ cnt: sql<number>`count(*)::int` })
      .from(booksTable)
      .where(whereExpr);

    const total = totalResult[0]?.cnt ?? 0;

    const rowsDb = await db
      .select()
      .from(booksTable)
      .where(whereExpr)
      .orderBy(orderDir === 'asc' ? asc(orderByExpr) : desc(orderByExpr))
      .limit(plan.limit)
      .offset(plan.offset);

    return {
      rows: rowsDb.map(rowToBook),
      total,
    };
  },

  async getById(id) {
    const rows = await db
      .select({
        id: booksTable.id,
        authorId: booksTable.authorId,
        title: booksTable.title,
        publishedYear: booksTable.publishedYear,
        status: booksTable.status,
        created_at: booksTable.created_at,
        updated_at: booksTable.updated_at,
      })
      .from(booksTable)
      .where(eq(booksTable.id, id))
      .limit(1);

    if (!rows[0]) return undefined;
    return rowToBook(rows[0] as BookRow);
  },

  async create(data) {
    const inserted = await db
      .insert(booksTable)
      .values({
        authorId: data.authorId,
        title: data.title,
        publishedYear:
          data.publishedYear === undefined ? null : data.publishedYear,
        status: data.status ?? 'draft',
        created_at: sql`now()`,
        updated_at: sql`now()`,
      })
      .returning();

    return rowToBook(inserted[0] as BookRow);
  },

  async update(id, patch) {
    const updatedRows = await db
      .update(booksTable)
      .set({
        ...(patch.title !== undefined ? { title: patch.title } : {}),
        ...(patch.publishedYear !== undefined
          ? { publishedYear: patch.publishedYear }
          : {}),
        ...(patch.status !== undefined ? { status: patch.status } : {}),
        ...(patch.authorId !== undefined ? { authorId: patch.authorId } : {}),
        updated_at: sql`now()`,
      })
      .where(eq(booksTable.id, id))
      .returning();

    if (!updatedRows[0]) return undefined;
    return rowToBook(updatedRows[0] as BookRow);
  },

  async delete(id) {
    const deleted = await db
      .delete(booksTable)
      .where(eq(booksTable.id, id))
      .returning({ id: booksTable.id });

    return !!deleted[0];
  },

  async listTagsForBook(bookId: string) {
    // join book_tags -> tags
    const rows = await db
      .select({
        id: tagsTable.id,
        label: tagsTable.label,
        created_at: tagsTable.created_at,
        updated_at: tagsTable.updated_at,
      })
      .from(bookTagsTable)
      .innerJoin(tagsTable, eq(bookTagsTable.tagId, tagsTable.id))
      .where(eq(bookTagsTable.bookId, bookId));

    return rows.map(rowToTag);
  },
};
