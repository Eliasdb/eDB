import { eq, sql } from 'drizzle-orm';
import { db } from '../../infra/db/client';
import { contacts } from '../../infra/db/schema';
import type { Contact, ContactPatch } from '../types/crm.types';

export const listContacts = () =>
  db.select().from(contacts).orderBy(contacts.createdAt);

export const getContact = async (id: string) =>
  (await db.select().from(contacts).where(eq(contacts.id, id)))[0];

export async function insertOrUpdateContact(c: Contact) {
  await db
    .insert(contacts)
    .values({
      id: c.id!,
      name: c.name,
      email: c.email ?? null,
      phone: c.phone ?? null,
      companyId: c.companyId ?? null,
      title: (c as any).title ?? null,
    })
    .onConflictDoUpdate({
      target: contacts.id,
      set: {
        name: sql`excluded.name`,
        email: sql`excluded.email`,
        phone: sql`excluded.phone`,
        company_id: sql`excluded.company_id`,
        title: sql`excluded.title`,
        updated_at: sql`now()`,
      } as any,
    });
  return c.id!;
}

export async function patchContact(id: string, p: ContactPatch) {
  // Use string keys that match schema properties
  const set: Record<string, any> = { updatedAt: sql`now()` };

  if (p.name !== undefined) set.name = p.name;
  if (p.email !== undefined) set.email = p.email;
  if (p.phone !== undefined) set.phone = p.phone;
  if ((p as any).companyId !== undefined) set.companyId = (p as any).companyId;
  if ((p as any).title !== undefined) set.title = (p as any).title;

  if (Object.keys(set).length === 1) return true; // only updatedAt → no-op

  const { rowCount } = await db
    .update(contacts)
    .set(set)
    .where(eq(contacts.id, id));
  return rowCount === 1;
}

export async function deleteContact(id: string) {
  const { rowCount } = await db.delete(contacts).where(eq(contacts.id, id));
  return rowCount === 1;
}
