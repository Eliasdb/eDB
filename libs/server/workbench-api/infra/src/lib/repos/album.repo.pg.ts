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
import { albumsTable } from '../db/schema.albums';

import type { Album, AlbumRepo } from '@edb-workbench/api/models';
import type { PaginationPlan } from '@edb-workbench/api/shared';

type AlbumRow = {
  id: string;
  title: string;
  author_id: string;
  status: string;
  published_year: number | null;
  created_at: Date;
  updated_at: Date;
};

function rowToAlbum(row: AlbumRow): Album {
  return {
    id: row.id,
    title: row.title,
    authorId: row.author_id,
    status: row.status as Album['status'],
    publishedYear: row.published_year ?? undefined,
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
    ors.push(like(sql`lower(${albumsTable.title})`, q));
    ors.push(like(sql`lower(${albumsTable.author_id}::text)`, q));
    ors.push(like(sql`lower(${albumsTable.status}::text)`, q));
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
    if (key === 'title') {
      parts.push(eq(albumsTable.title, val));
    }
    if (key === 'authorId') {
      parts.push(eq(albumsTable.author_id, val));
    }
    if (key === 'status') {
      parts.push(eq(albumsTable.status as any, val as any));
    }
    if (key === 'publishedYear') {
      const n = Number(val);
      if (!Number.isNaN(n)) parts.push(eq(albumsTable.published_year, n));
    }
  }
  return parts.length ? and(...parts) : undefined;
}

function buildOrder(plan: PaginationPlan): {
  orderByExpr: AnyColumn;
  orderDir: 'asc' | 'desc';
} {
  let orderByExpr: AnyColumn = albumsTable.created_at;
  let orderDir: 'asc' | 'desc' = 'asc';
  if (plan.sorters.length > 0) {
    const { field, dir } = plan.sorters[0];
    orderDir = dir;
    if (field === 'createdAt') orderByExpr = albumsTable.created_at;
    if (field === 'updatedAt') orderByExpr = albumsTable.updated_at;
    if (field === 'title') orderByExpr = albumsTable.title;
    if (field === 'authorId') orderByExpr = albumsTable.author_id;
    if (field === 'status') orderByExpr = albumsTable.status;
    if (field === 'publishedYear') orderByExpr = albumsTable.published_year;
  }
  return { orderByExpr, orderDir };
}

export const AlbumRepoPg: AlbumRepo = {
  async list(args) {
    const { plan, search, filter } = args;
    const mergedFilters = { ...(plan.filters ?? {}), ...(filter ?? {}) };
    const whereExpr = buildWhere({ search, mergedFilters });
    const whereSql = whereExpr ?? sql`true`;
    const { orderByExpr, orderDir } = buildOrder(plan);

    const totalResult = await db
      .select({ cnt: sql<number>`count(*)::int` })
      .from(albumsTable)
      .where(whereSql);
    const total = totalResult[0]?.cnt ?? 0;

    const rows = await db
      .select({
        id: albumsTable.id,
        title: albumsTable.title,
        author_id: albumsTable.author_id,
        status: albumsTable.status,
        published_year: albumsTable.published_year,
        created_at: albumsTable.created_at,
        updated_at: albumsTable.updated_at,
      })
      .from(albumsTable)
      .where(whereSql)
      .orderBy(orderDir === 'asc' ? asc(orderByExpr) : desc(orderByExpr))
      .limit(plan.limit)
      .offset(plan.offset);

    return { rows: rows.map(rowToAlbum), total };
  },

  async getById(id) {
    const rows = await db
      .select({
        id: albumsTable.id,
        title: albumsTable.title,
        author_id: albumsTable.author_id,
        status: albumsTable.status,
        published_year: albumsTable.published_year,
        created_at: albumsTable.created_at,
        updated_at: albumsTable.updated_at,
      })
      .from(albumsTable)
      .where(eq(albumsTable.id, id))
      .limit(1);
    return rows[0] ? rowToAlbum(rows[0] as AlbumRow) : undefined;
  },

  async create(data) {
    const inserted = await db
      .insert(albumsTable)
      .values({
        title: data.title,
        author_id: data.authorId,
        status: data.status,
        published_year: data.publishedYear ?? null,
        created_at: sql`now()`,
        updated_at: sql`now()`,
      })
      .returning();
    return rowToAlbum(inserted[0] as AlbumRow);
  },

  async update(id, patch) {
    const updated = await db
      .update(albumsTable)
      .set({
        ...(patch.title !== undefined ? { title: patch.title } : {}),
        ...(patch.authorId !== undefined ? { author_id: patch.authorId } : {}),
        ...(patch.status !== undefined ? { status: patch.status } : {}),
        ...(patch.publishedYear !== undefined
          ? { published_year: patch.publishedYear }
          : {}),
        updated_at: sql`now()`,
      })
      .where(eq(albumsTable.id, id))
      .returning();
    return updated[0] ? rowToAlbum(updated[0] as AlbumRow) : undefined;
  },

  async delete(id) {
    const del = await db
      .delete(albumsTable)
      .where(eq(albumsTable.id, id))
      .returning({ id: albumsTable.id });
    return !!del[0];
  },
};
