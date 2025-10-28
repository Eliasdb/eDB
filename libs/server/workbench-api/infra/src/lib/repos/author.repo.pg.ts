import { and, asc, desc, eq, like, or, sql, type AnyColumn } from 'drizzle-orm';

import { db } from '../db/drizzle';
import { authorsTable } from '../db/schema.authors';

import type {
  Author,
  AuthorRepo,
  CreateAuthorBody,
  UpdateAuthorBody,
} from '@edb-workbench/api/models';
import type { PaginationPlan } from '@edb-workbench/api/shared';

// map DB row -> API contract
function rowToAuthor(row: {
  id: string;
  firstName: string;
  lastName: string;
  bio: string | null;
  isActive: boolean;
  created_at: Date;
  updated_at: Date;
}): Author {
  return {
    id: row.id,
    firstName: row.firstName,
    lastName: row.lastName,
    bio: row.bio ?? undefined,
    isActive: row.isActive,
    createdAt: row.created_at.toISOString(),
    updatedAt: row.updated_at.toISOString(),
  };
}

export const AuthorRepoPg: AuthorRepo = {
  async list(args: {
    plan: PaginationPlan;
    search?: string;
    filter?: Record<string, string>;
  }): Promise<{ rows: Author[]; total: number }> {
    const { plan, search, filter } = args;

    const whereParts: any[] = [];

    // ── free-text search across firstName / lastName (case-insensitive)
    if (search && search.trim() !== '') {
      const q = `%${search.toLowerCase()}%`;

      // (lower(first_name) LIKE '%q%' OR lower(last_name) LIKE '%q%')
      whereParts.push(
        or(
          like(sql`lower(${authorsTable.firstName})`, q),
          like(sql`lower(${authorsTable.lastName})`, q),
        ),
      );
    }

    // ── merge filters from plan + explicit filter arg
    const mergedFilters = { ...(plan.filters ?? {}), ...(filter ?? {}) };

    for (const [key, val] of Object.entries(mergedFilters)) {
      if (key === 'isActive') {
        const boolVal = val === 'true';
        whereParts.push(eq(authorsTable.isActive, boolVal));
      }
      if (key === 'firstName') {
        whereParts.push(eq(authorsTable.firstName, val));
      }
      if (key === 'lastName') {
        whereParts.push(eq(authorsTable.lastName, val));
      }
    }

    // final WHERE = AND(all parts)
    const whereExpr = whereParts.length === 0 ? undefined : and(...whereParts);

    // ── sorting whitelist
    let orderByExpr: AnyColumn = authorsTable.created_at;
    let orderDir: 'asc' | 'desc' = 'asc';

    if (plan.sorters.length > 0) {
      const { field, dir } = plan.sorters[0];
      orderDir = dir;
      if (field === 'firstName') orderByExpr = authorsTable.firstName;
      if (field === 'lastName') orderByExpr = authorsTable.lastName;
      if (field === 'createdAt') orderByExpr = authorsTable.created_at;
    }

    // ── total count
    const totalResult = await db
      .select({ cnt: sql<number>`count(*)::int` })
      .from(authorsTable)
      .where(whereExpr);

    const total = totalResult[0]?.cnt ?? 0;

    // ── page slice
    const rowsDb = await db
      .select()
      .from(authorsTable)
      .where(whereExpr)
      .orderBy(orderDir === 'asc' ? asc(orderByExpr) : desc(orderByExpr))
      .limit(plan.limit)
      .offset(plan.offset);

    const rows = rowsDb.map(rowToAuthor);

    return { rows, total };
  },

  async getById(id: string): Promise<Author | undefined> {
    const rows = await db
      .select()
      .from(authorsTable)
      .where(eq(authorsTable.id, id))
      .limit(1);

    if (!rows[0]) return undefined;
    return rowToAuthor(rows[0]);
  },

  async create(data: CreateAuthorBody): Promise<Author> {
    const insertRes = await db
      .insert(authorsTable)
      .values({
        firstName: data.firstName,
        lastName: data.lastName,
        bio: data.bio ?? null,
        isActive: data.isActive ?? true,
        created_at: sql`now()`,
        updated_at: sql`now()`,
      })
      .returning();

    return rowToAuthor(insertRes[0]);
  },

  async update(
    id: string,
    patch: UpdateAuthorBody,
  ): Promise<Author | undefined> {
    const updateRes = await db
      .update(authorsTable)
      .set({
        ...(patch.firstName !== undefined
          ? { firstName: patch.firstName }
          : {}),
        ...(patch.lastName !== undefined ? { lastName: patch.lastName } : {}),
        ...(patch.bio !== undefined ? { bio: patch.bio } : {}),
        ...(patch.isActive !== undefined ? { isActive: patch.isActive } : {}),
        updated_at: sql`now()`,
      })
      .where(eq(authorsTable.id, id))
      .returning();

    if (!updateRes[0]) return undefined;
    return rowToAuthor(updateRes[0]);
  },

  async delete(id: string): Promise<boolean> {
    const delRes = await db
      .delete(authorsTable)
      .where(eq(authorsTable.id, id))
      .returning({ id: authorsTable.id });

    return !!delRes[0];
  },
};
