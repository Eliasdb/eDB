import { and, asc, desc, eq, like, sql, type AnyColumn } from 'drizzle-orm';
import { db } from '../db/drizzle';
import { bookTagsTable } from '../db/schema.bookTags';
import { tagsTable } from '../db/schema.tags';

import type {
  CreateTagBody,
  Tag,
  TagRepo,
  UpdateTagBody,
} from '@edb-workbench/api/models';
import type { PaginationPlan } from '@edb-workbench/api/shared';

type TagRow = {
  id: string;
  label: string;
  created_at: Date;
  updated_at: Date;
};

function rowToTag(r: TagRow): Tag {
  return {
    id: r.id,
    label: r.label,
    createdAt: r.created_at.toISOString(),
    updatedAt: r.updated_at.toISOString(),
  };
}

function buildOrder(plan: PaginationPlan): {
  orderByExpr: AnyColumn;
  orderDir: 'asc' | 'desc';
} {
  let orderByExpr: AnyColumn = tagsTable.created_at;
  let orderDir: 'asc' | 'desc' = 'asc';
  if (plan.sorters.length > 0) {
    const { field, dir } = plan.sorters[0];
    orderDir = dir;
    if (field === 'label') orderByExpr = tagsTable.label;
    if (field === 'createdAt') orderByExpr = tagsTable.created_at;
    if (field === 'updatedAt') orderByExpr = tagsTable.updated_at;
  }
  return { orderByExpr, orderDir };
}

export const TagRepoPg: TagRepo = {
  async list({ plan, search, filter }) {
    const filters = { ...(plan.filters ?? {}), ...(filter ?? {}) };

    const whereParts = [];
    if (search && search.trim() !== '') {
      const q = `%${search.toLowerCase()}%`;
      whereParts.push(like(sql`lower(${tagsTable.label})`, q));
    }
    if (filters['label'])
      whereParts.push(eq(tagsTable.label, filters['label']));

    const whereExpr = whereParts.length ? and(...whereParts) : undefined;

    const totalResult = await db
      .select({ cnt: sql<number>`count(*)::int` })
      .from(tagsTable)
      .where(whereExpr);
    const total = totalResult[0]?.cnt ?? 0;

    const { orderByExpr, orderDir } = buildOrder(plan);

    const rows = await db
      .select()
      .from(tagsTable)
      .where(whereExpr)
      .orderBy(orderDir === 'asc' ? asc(orderByExpr) : desc(orderByExpr))
      .limit(plan.limit)
      .offset(plan.offset);

    return { rows: rows.map(rowToTag as any), total };
  },

  async getById(id) {
    const [row] = await db
      .select()
      .from(tagsTable)
      .where(eq(tagsTable.id, id))
      .limit(1);
    return row ? rowToTag(row as TagRow) : undefined;
  },

  async create(data: CreateTagBody) {
    const [row] = await db
      .insert(tagsTable)
      .values({
        label: data.label,
        created_at: sql`now()`,
        updated_at: sql`now()`,
      })
      .returning();
    return rowToTag(row as TagRow);
  },

  async update(id: string, patch: UpdateTagBody) {
    const [row] = await db
      .update(tagsTable)
      .set({
        ...(patch.label !== undefined ? { label: patch.label } : {}),
        updated_at: sql`now()`,
      })
      .where(eq(tagsTable.id, id))
      .returning();
    return row ? rowToTag(row as TagRow) : undefined;
  },

  async delete(id: string) {
    const deleted = await db
      .delete(tagsTable)
      .where(eq(tagsTable.id, id))
      .returning({ id: tagsTable.id });
    return !!deleted[0];
  },

  // ← Required by TagRepo interface (used by resources layer)
  async listForBook(bookId: string) {
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

    return rows.map((r) => rowToTag(r as unknown as TagRow));
  },
};
