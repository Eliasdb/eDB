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
import { agentsTable } from '../db/schema.agents';

import type { Agent, AgentRepo } from '@edb-workbench/api/models';
import type { PaginationPlan } from '@edb-workbench/api/shared';

type AgentRow = {
  id: string;
  codename: string;
  status: string;
  clearance: number | null;
  specialty: string | null;
  created_at: Date;
  updated_at: Date;
};

function rowToAgent(row: AgentRow): Agent {
  return {
    id: row.id,
    codename: row.codename,
    status: row.status as Agent['status'],
    clearance: row.clearance ?? undefined,
    specialty: row.specialty ?? undefined,
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
    ors.push(like(sql`lower(${agentsTable.codename})`, q));
    ors.push(like(sql`lower(${agentsTable.status}::text)`, q));
    ors.push(like(sql`lower(${agentsTable.specialty})`, q));
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
    if (key === 'codename') {
      parts.push(eq(agentsTable.codename, val));
    }
    if (key === 'status') {
      parts.push(eq(agentsTable.status as any, val as any));
    }
    if (key === 'clearance') {
      const n = Number(val);
      if (!Number.isNaN(n)) parts.push(eq(agentsTable.clearance, n));
    }
    if (key === 'specialty') {
      parts.push(eq(agentsTable.specialty, val));
    }
  }
  return parts.length ? and(...parts) : undefined;
}

function buildOrder(plan: PaginationPlan): {
  orderByExpr: AnyColumn;
  orderDir: 'asc' | 'desc';
} {
  let orderByExpr: AnyColumn = agentsTable.created_at;
  let orderDir: 'asc' | 'desc' = 'asc';
  if (plan.sorters.length > 0) {
    const { field, dir } = plan.sorters[0];
    orderDir = dir;
    if (field === 'createdAt') orderByExpr = agentsTable.created_at;
    if (field === 'updatedAt') orderByExpr = agentsTable.updated_at;
    if (field === 'codename') orderByExpr = agentsTable.codename;
    if (field === 'status') orderByExpr = agentsTable.status;
    if (field === 'clearance') orderByExpr = agentsTable.clearance;
    if (field === 'specialty') orderByExpr = agentsTable.specialty;
  }
  return { orderByExpr, orderDir };
}

export const AgentRepoPg: AgentRepo = {
  async list(args) {
    const { plan, search, filter } = args;
    const mergedFilters = { ...(plan.filters ?? {}), ...(filter ?? {}) };
    const whereExpr = buildWhere({ search, mergedFilters });
    const whereSql = whereExpr ?? sql`true`;
    const { orderByExpr, orderDir } = buildOrder(plan);

    const totalResult = await db
      .select({ cnt: sql<number>`count(*)::int` })
      .from(agentsTable)
      .where(whereSql);
    const total = totalResult[0]?.cnt ?? 0;

    const rows = await db
      .select({
        id: agentsTable.id,
        codename: agentsTable.codename,
        status: agentsTable.status,
        clearance: agentsTable.clearance,
        specialty: agentsTable.specialty,
        created_at: agentsTable.created_at,
        updated_at: agentsTable.updated_at,
      })
      .from(agentsTable)
      .where(whereSql)
      .orderBy(orderDir === 'asc' ? asc(orderByExpr) : desc(orderByExpr))
      .limit(plan.limit)
      .offset(plan.offset);

    return { rows: rows.map(rowToAgent), total };
  },

  async getById(id) {
    const rows = await db
      .select({
        id: agentsTable.id,
        codename: agentsTable.codename,
        status: agentsTable.status,
        clearance: agentsTable.clearance,
        specialty: agentsTable.specialty,
        created_at: agentsTable.created_at,
        updated_at: agentsTable.updated_at,
      })
      .from(agentsTable)
      .where(eq(agentsTable.id, id))
      .limit(1);
    return rows[0] ? rowToAgent(rows[0] as AgentRow) : undefined;
  },

  async create(data) {
    const inserted = await db
      .insert(agentsTable)
      .values({
        codename: data.codename,
        status: data.status,
        clearance: data.clearance ?? null,
        specialty: data.specialty ?? null,
        created_at: sql`now()`,
        updated_at: sql`now()`,
      })
      .returning();
    return rowToAgent(inserted[0] as AgentRow);
  },

  async update(id, patch) {
    const updated = await db
      .update(agentsTable)
      .set({
        ...(patch.codename !== undefined ? { codename: patch.codename } : {}),
        ...(patch.status !== undefined ? { status: patch.status } : {}),
        ...(patch.clearance !== undefined
          ? { clearance: patch.clearance }
          : {}),
        ...(patch.specialty !== undefined
          ? { specialty: patch.specialty }
          : {}),
        updated_at: sql`now()`,
      })
      .where(eq(agentsTable.id, id))
      .returning();
    return updated[0] ? rowToAgent(updated[0] as AgentRow) : undefined;
  },

  async delete(id) {
    const del = await db
      .delete(agentsTable)
      .where(eq(agentsTable.id, id))
      .returning({ id: agentsTable.id });
    return !!del[0];
  },
};
