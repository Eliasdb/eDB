import {
  and,
  asc,
  desc,
  eq,
  like,
  sql,
  type AnyColumn,
  type SQL,
} from 'drizzle-orm';

import { db } from '../../db/orm/drizzle';
import { gadgetsTable } from '../../db/schemas/gadgets';

import type { Gadget, GadgetRepo } from '@edb-workbench/api/models';
import type { PaginationPlan } from '@edb-workbench/api/shared';

type GadgetRow = {
  id: string;
  name: string;
  category: string;
  weight_gr: number | null;
  discontinued: boolean | null;
  released_at: Date | null;
  created_at: Date;
  updated_at: Date;
};

function rowToGadget(row: GadgetRow): Gadget {
  return {
    id: row.id,
    name: row.name,
    category: row.category as Gadget['category'],
    weightGr: row.weight_gr ?? undefined,
    discontinued: row.discontinued ?? undefined,
    releasedAt: row.released_at ? row.released_at.toISOString() : undefined,
    createdAt: row.created_at.toISOString(),
    updatedAt: row.updated_at.toISOString(),
  };
}

function buildWhere({
  search,
  mergedFilters,
}: {
  search?: string;
  mergedFilters: Record<string, string>;
}): SQL | undefined {
  const parts: SQL[] = [];
  if (search && search.trim() !== '') {
    const q = '%' + search.toLowerCase() + '%';
    const ors: SQL[] = [];
    ors.push(like(sql`lower(${gadgetsTable.name})`, q));
    ors.push(like(sql`lower(${gadgetsTable.category}::text)`, q));
    ors.push(like(sql`lower(${gadgetsTable.released_at}::text)`, q));
    if (ors.length === 1) {
      parts.push(ors[0]);
    } else if (ors.length > 1) {
      const disj = ors
        .slice(1)
        .reduce<SQL>((acc, cur) => sql`(${acc}) OR (${cur})`, ors[0]);
      parts.push(disj);
    }
  }
  for (const [key, val] of Object.entries(mergedFilters)) {
    if (key === 'name') {
      parts.push(eq(gadgetsTable.name, val));
    }
    if (key === 'category') {
      parts.push(eq(gadgetsTable.category as any, val as any));
    }
    if (key === 'weightGr') {
      const n = Number(val);
      if (!Number.isNaN(n)) parts.push(eq(gadgetsTable.weight_gr, n));
    }
    if (key === 'discontinued') {
      parts.push(eq(gadgetsTable.discontinued, val === 'true'));
    }
    if (key === 'releasedAt') {
      const d = new Date(val);
      if (!Number.isNaN(d.getTime()))
        parts.push(eq(gadgetsTable.released_at, d));
    }
  }
  return parts.length ? and(...parts) : undefined;
}

function buildOrder(plan: PaginationPlan): {
  orderByExpr: AnyColumn;
  orderDir: 'asc' | 'desc';
} {
  let orderByExpr: AnyColumn = gadgetsTable.created_at;
  let orderDir: 'asc' | 'desc' = 'asc';
  if (plan.sorters.length > 0) {
    const { field, dir } = plan.sorters[0];
    orderDir = dir;
    if (field === 'createdAt') orderByExpr = gadgetsTable.created_at;
    if (field === 'updatedAt') orderByExpr = gadgetsTable.updated_at;
    if (field === 'name') orderByExpr = gadgetsTable.name;
    if (field === 'category') orderByExpr = gadgetsTable.category;
    if (field === 'weightGr') orderByExpr = gadgetsTable.weight_gr;
    if (field === 'discontinued') orderByExpr = gadgetsTable.discontinued;
    if (field === 'releasedAt') orderByExpr = gadgetsTable.released_at;
  }
  return { orderByExpr, orderDir };
}

export const GadgetRepoPg: GadgetRepo = {
  async list(args) {
    const { plan, search, filter } = args;
    const mergedFilters = { ...(plan.filters ?? {}), ...(filter ?? {}) };
    const whereExpr = buildWhere({ search, mergedFilters });
    const whereSql = whereExpr ?? sql`true`;
    const { orderByExpr, orderDir } = buildOrder(plan);

    const totalResult = await db
      .select({ cnt: sql<number>`count(*)::int` })
      .from(gadgetsTable)
      .where(whereSql);
    const total = totalResult[0]?.cnt ?? 0;

    const rows = await db
      .select({
        id: gadgetsTable.id,
        name: gadgetsTable.name,
        category: gadgetsTable.category,
        weight_gr: gadgetsTable.weight_gr,
        discontinued: gadgetsTable.discontinued,
        released_at: gadgetsTable.released_at,
        created_at: gadgetsTable.created_at,
        updated_at: gadgetsTable.updated_at,
      })
      .from(gadgetsTable)
      .where(whereSql)
      .orderBy(orderDir === 'asc' ? asc(orderByExpr) : desc(orderByExpr))
      .limit(plan.limit)
      .offset(plan.offset);

    return { rows: rows.map(rowToGadget), total };
  },

  async getById(id) {
    const rows = await db
      .select({
        id: gadgetsTable.id,
        name: gadgetsTable.name,
        category: gadgetsTable.category,
        weight_gr: gadgetsTable.weight_gr,
        discontinued: gadgetsTable.discontinued,
        released_at: gadgetsTable.released_at,
        created_at: gadgetsTable.created_at,
        updated_at: gadgetsTable.updated_at,
      })
      .from(gadgetsTable)
      .where(eq(gadgetsTable.id, id))
      .limit(1);
    return rows[0] ? rowToGadget(rows[0] as GadgetRow) : undefined;
  },

  async create(data) {
    const inserted = await db
      .insert(gadgetsTable)
      .values({
        name: data.name,
        category: data.category,
        weight_gr: data.weightGr ?? null,
        discontinued: data.discontinued ?? null,
        released_at: data.releasedAt ? new Date(data.releasedAt) : null,
        created_at: sql`now()`,
        updated_at: sql`now()`,
      })
      .returning();
    return rowToGadget(inserted[0] as GadgetRow);
  },

  async update(id, patch) {
    const updated = await db
      .update(gadgetsTable)
      .set({
        ...(patch.supplierId !== undefined ? {} : {}),

        ...(patch.name !== undefined ? { name: patch.name } : {}),
        ...(patch.category !== undefined ? { category: patch.category } : {}),
        ...(patch.weightGr !== undefined ? { weight_gr: patch.weightGr } : {}),
        ...(patch.discontinued !== undefined
          ? { discontinued: patch.discontinued }
          : {}),
        ...(patch.releasedAt !== undefined
          ? { released_at: new Date(patch.releasedAt as string) }
          : {}),
        updated_at: sql`now()`,
      })
      .where(eq(gadgetsTable.id, id))
      .returning();
    return updated[0] ? rowToGadget(updated[0] as GadgetRow) : undefined;
  },

  async delete(id) {
    const del = await db
      .delete(gadgetsTable)
      .where(eq(gadgetsTable.id, id))
      .returning({ id: gadgetsTable.id });
    return !!del[0];
  },
};
