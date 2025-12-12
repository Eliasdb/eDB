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
import { suppliersTable } from '../../db/schemas/suppliers';

import type { Supplier, SupplierRepo } from '@edb-workbench/api/models';
import type { PaginationPlan } from '@edb-workbench/api/shared';

type SupplierRow = {
  id: string;
  name: string;
  country: string | null;
  rating: number | null;
  contact_email: string | null;
  created_at: Date;
  updated_at: Date;
};

function rowToSupplier(row: SupplierRow): Supplier {
  return {
    id: row.id,
    name: row.name,
    country: row.country ?? undefined,
    rating: row.rating ?? undefined,
    contactEmail: row.contact_email ?? undefined,
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
    ors.push(like(sql`lower(${suppliersTable.name})`, q));
    ors.push(like(sql`lower(${suppliersTable.country})`, q));
    ors.push(like(sql`lower(${suppliersTable.contact_email})`, q));
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
      parts.push(eq(suppliersTable.name, val));
    }
    if (key === 'country') {
      parts.push(eq(suppliersTable.country, val));
    }
    if (key === 'rating') {
      const n = Number(val);
      if (!Number.isNaN(n)) parts.push(eq(suppliersTable.rating, n));
    }
    if (key === 'contactEmail') {
      parts.push(eq(suppliersTable.contact_email, val));
    }
  }
  return parts.length ? and(...parts) : undefined;
}

function buildOrder(plan: PaginationPlan): {
  orderByExpr: AnyColumn;
  orderDir: 'asc' | 'desc';
} {
  let orderByExpr: AnyColumn = suppliersTable.created_at;
  let orderDir: 'asc' | 'desc' = 'asc';
  if (plan.sorters.length > 0) {
    const { field, dir } = plan.sorters[0];
    orderDir = dir;
    if (field === 'createdAt') orderByExpr = suppliersTable.created_at;
    if (field === 'updatedAt') orderByExpr = suppliersTable.updated_at;
    if (field === 'name') orderByExpr = suppliersTable.name;
    if (field === 'country') orderByExpr = suppliersTable.country;
    if (field === 'rating') orderByExpr = suppliersTable.rating;
    if (field === 'contactEmail') orderByExpr = suppliersTable.contact_email;
  }
  return { orderByExpr, orderDir };
}

export const SupplierRepoPg: SupplierRepo = {
  async list(args) {
    const { plan, search, filter } = args;
    const mergedFilters = { ...(plan.filters ?? {}), ...(filter ?? {}) };
    const whereExpr = buildWhere({ search, mergedFilters });
    const whereSql = whereExpr ?? sql`true`;
    const { orderByExpr, orderDir } = buildOrder(plan);

    const totalResult = await db
      .select({ cnt: sql<number>`count(*)::int` })
      .from(suppliersTable)
      .where(whereSql);
    const total = totalResult[0]?.cnt ?? 0;

    const rows = await db
      .select({
        id: suppliersTable.id,
        name: suppliersTable.name,
        country: suppliersTable.country,
        rating: suppliersTable.rating,
        contact_email: suppliersTable.contact_email,
        created_at: suppliersTable.created_at,
        updated_at: suppliersTable.updated_at,
      })
      .from(suppliersTable)
      .where(whereSql)
      .orderBy(orderDir === 'asc' ? asc(orderByExpr) : desc(orderByExpr))
      .limit(plan.limit)
      .offset(plan.offset);

    return { rows: rows.map(rowToSupplier), total };
  },

  async getById(id) {
    const rows = await db
      .select({
        id: suppliersTable.id,
        name: suppliersTable.name,
        country: suppliersTable.country,
        rating: suppliersTable.rating,
        contact_email: suppliersTable.contact_email,
        created_at: suppliersTable.created_at,
        updated_at: suppliersTable.updated_at,
      })
      .from(suppliersTable)
      .where(eq(suppliersTable.id, id))
      .limit(1);
    return rows[0] ? rowToSupplier(rows[0] as SupplierRow) : undefined;
  },

  async create(data) {
    const inserted = await db
      .insert(suppliersTable)
      .values({
        name: data.name,
        country: data.country ?? null,
        rating: data.rating ?? null,
        contact_email: data.contactEmail ?? null,
        created_at: sql`now()`,
        updated_at: sql`now()`,
      })
      .returning();
    return rowToSupplier(inserted[0] as SupplierRow);
  },

  async update(id, patch) {
    const updated = await db
      .update(suppliersTable)
      .set({
        ...(patch.name !== undefined ? { name: patch.name } : {}),
        ...(patch.country !== undefined ? { country: patch.country } : {}),
        ...(patch.rating !== undefined ? { rating: patch.rating } : {}),
        ...(patch.contactEmail !== undefined
          ? { contact_email: patch.contactEmail }
          : {}),
        updated_at: sql`now()`,
      })
      .where(eq(suppliersTable.id, id))
      .returning();
    return updated[0] ? rowToSupplier(updated[0] as SupplierRow) : undefined;
  },

  async delete(id) {
    const del = await db
      .delete(suppliersTable)
      .where(eq(suppliersTable.id, id))
      .returning({ id: suppliersTable.id });
    return !!del[0];
  },
};
