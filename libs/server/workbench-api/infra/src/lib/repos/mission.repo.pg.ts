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
import { missionsTable } from '../db/schema.missions';

import type { Mission, MissionRepo } from '@edb-workbench/api/models';
import type { PaginationPlan } from '@edb-workbench/api/shared';

type MissionRow = {
  id: string;
  title: string;
  status: string;
  risk_level: number | null;
  eta: Date | null;
  created_at: Date;
  updated_at: Date;

  agent_id: string;
};

function rowToMission(row: MissionRow): Mission {
  return {
    id: row.id,
    agentId: row.agent_id,

    title: row.title,
    status: row.status as Mission['status'],
    riskLevel: row.risk_level ?? undefined,
    eta: row.eta ? row.eta.toISOString() : undefined,
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
    const ors: SQL[] = [
      like(sql`lower(${missionsTable.title})`, q),
      like(sql`lower(${missionsTable.status}::text)`, q),
      like(sql`lower(${missionsTable.eta}::text)`, q),
    ];
    const disj = ors.reduce<SQL | null>(
      (acc, cur) => (acc ? sql`(${acc}) OR (${cur})` : cur),
      null,
    );
    if (disj) parts.push(disj);
  }

  for (const [key, val] of Object.entries(mergedFilters)) {
    switch (key) {
      case 'title':
        parts.push(eq(missionsTable.title, val));
        break;
      case 'status':
        parts.push(eq(missionsTable.status as any, val as any));
        break;
      case 'riskLevel': {
        const n = Number(val);
        if (!Number.isNaN(n)) parts.push(eq(missionsTable.risk_level, n));
        break;
      }
      case 'eta': {
        const d = new Date(val);
        if (!Number.isNaN(d.getTime())) parts.push(eq(missionsTable.eta, d));
        break;
      }
      case 'agentId':
        parts.push(eq(missionsTable.agent_id as any, val as any));
        break;
    }
  }

  return parts.length ? and(...parts) : undefined;
}

function buildOrder(plan: PaginationPlan): {
  orderByExpr: AnyColumn;
  orderDir: 'asc' | 'desc';
} {
  let orderByExpr: AnyColumn = missionsTable.created_at;
  let orderDir: 'asc' | 'desc' = 'asc';
  if (plan.sorters.length > 0) {
    const { field, dir } = plan.sorters[0];
    orderDir = dir;
    if (field === 'createdAt') orderByExpr = missionsTable.created_at;
    if (field === 'updatedAt') orderByExpr = missionsTable.updated_at;
    if (field === 'title') orderByExpr = missionsTable.title;
    if (field === 'status') orderByExpr = missionsTable.status;
    if (field === 'riskLevel') orderByExpr = missionsTable.risk_level;
    if (field === 'eta') orderByExpr = missionsTable.eta;
  }
  return { orderByExpr, orderDir };
}

export const MissionRepoPg: MissionRepo = {
  async list(args) {
    const { plan, search, filter } = args;
    const mergedFilters = { ...(plan.filters ?? {}), ...(filter ?? {}) };
    const whereExpr = buildWhere({ search, mergedFilters });
    const whereSql = whereExpr ?? sql`true`;
    const { orderByExpr, orderDir } = buildOrder(plan);

    const totalResult = await db
      .select({ cnt: sql<number>`count(*)::int` })
      .from(missionsTable)
      .where(whereSql);
    const total = totalResult[0]?.cnt ?? 0;

    const rows = await db
      .select({
        id: missionsTable.id,
        title: missionsTable.title,
        status: missionsTable.status,
        risk_level: missionsTable.risk_level,
        eta: missionsTable.eta,
        created_at: missionsTable.created_at,
        updated_at: missionsTable.updated_at,
        agent_id: missionsTable.agent_id,
      })
      .from(missionsTable)
      .where(whereSql)
      .orderBy(orderDir === 'asc' ? asc(orderByExpr) : desc(orderByExpr))
      .limit(plan.limit)
      .offset(plan.offset);

    return { rows: rows.map(rowToMission), total };
  },

  async getById(id) {
    const rows = await db
      .select({
        id: missionsTable.id,
        title: missionsTable.title,
        status: missionsTable.status,
        risk_level: missionsTable.risk_level,
        eta: missionsTable.eta,
        created_at: missionsTable.created_at,
        updated_at: missionsTable.updated_at,
        agent_id: missionsTable.agent_id,
      })
      .from(missionsTable)
      .where(eq(missionsTable.id, id))
      .limit(1);
    return rows[0] ? rowToMission(rows[0] as MissionRow) : undefined;
  },

  async create(data) {
    const inserted = await db
      .insert(missionsTable)
      .values({
        agent_id: data.agentId,
        title: data.title,
        status: data.status,
        risk_level: data.riskLevel ?? null,
        eta: data.eta ? new Date(data.eta) : null,
        created_at: sql`now()`,
        updated_at: sql`now()`,
      })
      .returning();
    return rowToMission(inserted[0] as MissionRow);
  },

  async update(id, patch) {
    const updated = await db
      .update(missionsTable)
      .set({
        ...(patch.agentId !== undefined ? { agent_id: patch.agentId } : {}),
        ...(patch.title !== undefined ? { title: patch.title } : {}),
        ...(patch.status !== undefined ? { status: patch.status } : {}),
        ...(patch.riskLevel !== undefined
          ? { risk_level: patch.riskLevel }
          : {}),
        ...(patch.eta !== undefined
          ? { eta: patch.eta ? new Date(patch.eta) : undefined }
          : {}),
        updated_at: sql`now()`,
      })
      .where(eq(missionsTable.id, id))
      .returning();
    return updated[0] ? rowToMission(updated[0] as MissionRow) : undefined;
  },

  async delete(id) {
    const del = await db
      .delete(missionsTable)
      .where(eq(missionsTable.id, id))
      .returning({ id: missionsTable.id });
    return !!del[0];
  },
};
