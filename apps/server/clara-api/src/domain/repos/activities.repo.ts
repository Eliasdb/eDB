import { eq, sql } from 'drizzle-orm';
import { db } from '../../infra/db/client';
import { activities } from '../../infra/db/schema';
import type { Activity, ActivityPatch } from '../types/crm.types';

export const listActivities = () =>
  db.select().from(activities).orderBy(activities.createdAt);

export const getActivity = async (id: string) =>
  (await db.select().from(activities).where(eq(activities.id, id)))[0];

export async function insertOrUpdateActivity(a: Activity) {
  await db
    .insert(activities)
    .values({
      id: a.id!,
      type: a.type,
      summary: a.summary,
      contactId: a.contactId ?? null,
      companyId: a.companyId ?? null,
      at: a.at,
    })
    .onConflictDoUpdate({
      target: activities.id,
      set: {
        type: sql`excluded.type`,
        summary: sql`excluded.summary`,
        contact_id: sql`excluded.contact_id`,
        company_id: sql`excluded.company_id`,
        at: sql`excluded.at`,
        updated_at: sql`now()`,
      } as any,
    });
  return a.id!;
}

export async function patchActivity(id: string, p: ActivityPatch) {
  const set: Record<string, any> = { updatedAt: sql`now()` };

  if (p.type !== undefined) set.type = p.type;
  if (p.summary !== undefined) set.summary = p.summary;
  if (p.at !== undefined) set.at = p.at; // ISO string with offset
  if ((p as any).contactId !== undefined) set.contactId = (p as any).contactId; // allow null to clear
  if ((p as any).companyId !== undefined) set.companyId = (p as any).companyId; // allow null to clear

  if (Object.keys(set).length === 1) return true;

  const { rowCount } = await db
    .update(activities)
    .set(set)
    .where(eq(activities.id, id));
  return rowCount === 1;
}

export async function deleteActivity(id: string) {
  const { rowCount } = await db.delete(activities).where(eq(activities.id, id));
  return rowCount === 1;
}
