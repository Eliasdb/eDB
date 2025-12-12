import { eq, sql } from 'drizzle-orm';
import { db } from '../../infra/db/client';
import { tasks } from '../../infra/db/schema';
import type { Task, TaskPatch } from '../types/crm.types';

export const listTasks = () => db.select().from(tasks).orderBy(tasks.createdAt);

export const getTask = async (id: string) =>
  (await db.select().from(tasks).where(eq(tasks.id, id)))[0];

export async function insertOrUpdateTask(t: Task) {
  await db
    .insert(tasks)
    .values({
      id: t.id!,
      title: t.title,
      done: !!t.done,
      due: (t as any).due ?? null,
      contactId: t.contactId ?? null,
      companyId: t.companyId ?? null,
    })
    .onConflictDoUpdate({
      target: tasks.id,
      set: {
        title: sql`excluded.title`,
        done: sql`excluded.done`,
        due: sql`excluded.due`,
        contact_id: sql`excluded.contact_id`,
        company_id: sql`excluded.company_id`,
        updated_at: sql`now()`,
      } as any,
    });
  return t.id!;
}

export async function patchTask(id: string, p: TaskPatch) {
  // Build SET with string keys (camelCase), not column objects
  const set: Record<string, any> = { updatedAt: sql`now()` };

  if (p.title !== undefined) set.title = p.title;
  if (p.done !== undefined) set.done = p.done; // boolean
  if (p.due !== undefined) set.due = p.due; // 'YYYY-MM-DD'
  if ((p as any).contactId !== undefined) set.contactId = (p as any).contactId;
  if ((p as any).companyId !== undefined) set.companyId = (p as any).companyId;

  // If nothing to update, skip query to avoid empty SET
  if (Object.keys(set).length === 1) return true;

  const { rowCount } = await db.update(tasks).set(set).where(eq(tasks.id, id));
  return rowCount === 1;
}

export async function deleteTask(id: string) {
  const { rowCount } = await db.delete(tasks).where(eq(tasks.id, id));
  return rowCount === 1;
}
