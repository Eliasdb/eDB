import { and, eq, ilike, sql } from 'drizzle-orm';
import { db } from '../db/drizzle';
import { tagsTable } from '../db/schema.tags';

import type { PaginationPlan } from '@edb-workbench/api/shared';

export interface Tag {
  id: string;
  label: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTagBody {
  label: string;
}

export interface UpdateTagBody {
  label?: string;
}

export const TagRepoPg = {
  async create(data: CreateTagBody): Promise<Tag> {
    const inserted = await db
      .insert(tagsTable)
      .values({
        label: data.label,
        created_at: sql`now()`,
        updated_at: sql`now()`,
      })
      .returning();

    const row = inserted[0];
    return {
      id: row.id,
      label: row.label,
      createdAt: row.created_at.toISOString(),
      updatedAt: row.updated_at.toISOString(),
    };
  },

  async update(id: string, patch: UpdateTagBody): Promise<Tag | undefined> {
    const updated = await db
      .update(tagsTable)
      .set({ ...patch, updated_at: sql`now()` })
      .where(eq(tagsTable.id, id))
      .returning();

    const row = updated[0];
    return row
      ? {
          id: row.id,
          label: row.label,
          createdAt: row.created_at.toISOString(),
          updatedAt: row.updated_at.toISOString(),
        }
      : undefined;
  },

  async delete(id: string): Promise<boolean> {
    const deleted = await db
      .delete(tagsTable)
      .where(eq(tagsTable.id, id))
      .returning({ id: tagsTable.id });
    return deleted.length > 0;
  },

  async getById(id: string): Promise<Tag | undefined> {
    const row = await db.query.tagsTable.findFirst({
      where: (t, { eq }) => eq(t.id, id),
    });
    return row
      ? {
          id: row.id,
          label: row.label,
          createdAt: row.created_at.toISOString(),
          updatedAt: row.updated_at.toISOString(),
        }
      : undefined;
  },

  async list({
    plan,
    search,
    filter,
  }: {
    plan: PaginationPlan;
    search?: string;
    filter?: Record<string, string>;
  }): Promise<{ rows: Tag[]; total: number }> {
    const whereClauses = [];

    if (search) {
      whereClauses.push(ilike(tagsTable.label, `%${search}%`));
    }

    if (filter?.['label']) {
      whereClauses.push(eq(tagsTable.label, filter['label']));
    }

    const where = whereClauses.length > 0 ? and(...whereClauses) : undefined;

    const rows = await db
      .select()
      .from(tagsTable)
      .where(where ?? sql`TRUE`)
      .limit(plan.limit ?? 10)
      .offset(plan.offset ?? 0)
      .orderBy(tagsTable.label);

    const totalRes = await db
      .select({ count: sql<number>`count(*)` })
      .from(tagsTable)
      .where(where ?? sql`TRUE`);

    const total = Number(totalRes[0].count);

    return {
      rows: rows.map((r) => ({
        id: r.id,
        label: r.label,
        createdAt: r.created_at.toISOString(),
        updatedAt: r.updated_at.toISOString(),
      })),
      total,
    };
  },
};
