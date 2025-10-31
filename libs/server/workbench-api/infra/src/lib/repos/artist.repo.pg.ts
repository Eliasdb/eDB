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

import { db } from '../db/drizzle';
import { artistsTable } from '../db/schema.artists';

import type { Artist, ArtistRepo } from '@edb-workbench/api/models';
import type { PaginationPlan } from '@edb-workbench/api/shared';

type ArtistRow = {
  id: string;
  name: string;
  country: string | null;
  status: string;
  formed_at: Date | null;
  website: string | null;
  external_id: string | null;
  created_at: Date;
  updated_at: Date;
};

function rowToArtist(row: ArtistRow): Artist {
  return {
    id: row.id,
    name: row.name,
    country: row.country ?? undefined,
    status: row.status as Artist['status'],
    formedAt: row.formed_at ? row.formed_at.toISOString() : undefined,
    website: row.website ?? undefined,
    externalId: row.external_id ?? undefined,
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
    ors.push(like(sql`lower(${artistsTable.name})`, q));
    ors.push(like(sql`lower(${artistsTable.country})`, q));
    ors.push(like(sql`lower(${artistsTable.status}::text)`, q));
    ors.push(like(sql`lower(${artistsTable.formed_at}::text)`, q));
    ors.push(like(sql`lower(${artistsTable.website})`, q));
    ors.push(like(sql`lower(${artistsTable.external_id}::text)`, q));
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
      parts.push(eq(artistsTable.name, val));
    }
    if (key === 'country') {
      parts.push(eq(artistsTable.country, val));
    }
    if (key === 'status') {
      parts.push(eq(artistsTable.status as any, val as any));
    }
    if (key === 'formedAt') {
      const d = new Date(val);
      if (!Number.isNaN(d.getTime())) parts.push(eq(artistsTable.formed_at, d));
    }
    if (key === 'website') {
      parts.push(eq(artistsTable.website, val));
    }
    if (key === 'externalId') {
      parts.push(eq(artistsTable.external_id, val));
    }
  }
  return parts.length ? and(...parts) : undefined;
}

function buildOrder(plan: PaginationPlan): {
  orderByExpr: AnyColumn;
  orderDir: 'asc' | 'desc';
} {
  let orderByExpr: AnyColumn = artistsTable.created_at;
  let orderDir: 'asc' | 'desc' = 'asc';
  if (plan.sorters.length > 0) {
    const { field, dir } = plan.sorters[0];
    orderDir = dir;
    if (field === 'createdAt') orderByExpr = artistsTable.created_at;
    if (field === 'updatedAt') orderByExpr = artistsTable.updated_at;
    if (field === 'name') orderByExpr = artistsTable.name;
    if (field === 'country') orderByExpr = artistsTable.country;
    if (field === 'status') orderByExpr = artistsTable.status;
    if (field === 'formedAt') orderByExpr = artistsTable.formed_at;
    if (field === 'website') orderByExpr = artistsTable.website;
    if (field === 'externalId') orderByExpr = artistsTable.external_id;
  }
  return { orderByExpr, orderDir };
}

export const ArtistRepoPg: ArtistRepo = {
  async list(args) {
    const { plan, search, filter } = args;
    const mergedFilters = { ...(plan.filters ?? {}), ...(filter ?? {}) };
    const whereExpr = buildWhere({ search, mergedFilters });
    const whereSql = whereExpr ?? sql`true`;
    const { orderByExpr, orderDir } = buildOrder(plan);

    const totalResult = await db
      .select({ cnt: sql<number>`count(*)::int` })
      .from(artistsTable)
      .where(whereSql);
    const total = totalResult[0]?.cnt ?? 0;

    const rows = await db
      .select({
        id: artistsTable.id,
        name: artistsTable.name,
        country: artistsTable.country,
        status: artistsTable.status,
        formed_at: artistsTable.formed_at,
        website: artistsTable.website,
        external_id: artistsTable.external_id,
        created_at: artistsTable.created_at,
        updated_at: artistsTable.updated_at,
      })
      .from(artistsTable)
      .where(whereSql)
      .orderBy(orderDir === 'asc' ? asc(orderByExpr) : desc(orderByExpr))
      .limit(plan.limit)
      .offset(plan.offset);

    return { rows: rows.map(rowToArtist), total };
  },

  async getById(id) {
    const rows = await db
      .select({
        id: artistsTable.id,
        name: artistsTable.name,
        country: artistsTable.country,
        status: artistsTable.status,
        formed_at: artistsTable.formed_at,
        website: artistsTable.website,
        external_id: artistsTable.external_id,
        created_at: artistsTable.created_at,
        updated_at: artistsTable.updated_at,
      })
      .from(artistsTable)
      .where(eq(artistsTable.id, id))
      .limit(1);
    return rows[0] ? rowToArtist(rows[0] as ArtistRow) : undefined;
  },

  async create(data) {
    const inserted = await db
      .insert(artistsTable)
      .values({
        name: data.name,
        country: data.country ?? null,
        status: data.status,
        formed_at: data.formedAt ? new Date(data.formedAt) : null,
        website: data.website ?? null,
        external_id: data.externalId ?? null,
        created_at: sql`now()`,
        updated_at: sql`now()`,
      })
      .returning();
    return rowToArtist(inserted[0] as ArtistRow);
  },

  async update(id, patch) {
    const updated = await db
      .update(artistsTable)
      .set({
        ...(patch.name !== undefined ? { name: patch.name } : {}),
        ...(patch.country !== undefined ? { country: patch.country } : {}),
        ...(patch.status !== undefined ? { status: patch.status } : {}),
        ...(patch.formedAt !== undefined
          ? { formed_at: patch.formedAt ? new Date(patch.formedAt) : undefined }
          : {}),
        ...(patch.website !== undefined ? { website: patch.website } : {}),
        ...(patch.externalId !== undefined
          ? { external_id: patch.externalId }
          : {}),
        updated_at: sql`now()`,
      })
      .where(eq(artistsTable.id, id))
      .returning();
    return updated[0] ? rowToArtist(updated[0] as ArtistRow) : undefined;
  },

  async delete(id) {
    const del = await db
      .delete(artistsTable)
      .where(eq(artistsTable.id, id))
      .returning({ id: artistsTable.id });
    return !!del[0];
  },
};
