import { eq, sql } from 'drizzle-orm';
import { db } from '../../infra/db/client';
import { companies, contacts } from '../../infra/db/schema';
import type { Company, CompanyPatch } from '../types/crm.types';

export async function listCompanies() {
  return db.select().from(companies).orderBy(companies.createdAt);
}

export async function getCompany(id: string) {
  const [row] = await db.select().from(companies).where(eq(companies.id, id));
  return row;
}

export async function insertOrUpdateCompany(c: Company) {
  // small normalization
  const website =
    c.website && !/^https?:\/\//i.test(c.website)
      ? `https://${c.website}`
      : (c.website ?? null);

  await db
    .insert(companies)
    .values({
      id: c.id!,
      name: c.name,
      website,
      stage: c.stage ?? null,
      industry: (c as any).industry ?? null,
      description: (c as any).description ?? null,
      hq: (c as any).hq ?? null,
      employees: (c as any).employees ?? null,
      employeesRange: (c as any).employeesRange ?? null,
      ownerContactId: (c as any).ownerContactId ?? null,
      primaryEmail: (c as any).primaryEmail ?? null,
      phone: (c as any).phone ?? null,
    })
    .onConflictDoUpdate({
      target: companies.id,
      set: {
        name: sql`excluded.name`,
        website: sql`excluded.website`,
        stage: sql`excluded.stage`,
        industry: sql`excluded.industry`,
        description: sql`excluded.description`,
        hq: sql`excluded.hq`,
        employees: sql`excluded.employees`,
        employees_range: sql`excluded.employees_range`,
        owner_contact_id: sql`excluded.owner_contact_id`,
        primary_email: sql`excluded.primary_email`,
        phone: sql`excluded.phone`,
        updated_at: sql`now()`,
      } as any,
    });

  return c.id!;
}

export async function patchCompany(id: string, patch: CompanyPatch) {
  // Build SET with string keys matching schema property names
  const set: Record<string, any> = { updatedAt: sql`now()` };

  const put = (key: keyof typeof companies, val: unknown) => {
    if (val !== undefined) set[key as string] = val;
  };

  put('name', patch.name);
  put('website', patch.website);
  put('stage', patch.stage);
  put('industry', (patch as any).industry);
  put('description', (patch as any).description);
  put('employees', (patch as any).employees);
  put('employeesRange', (patch as any).employeesRange);
  put('ownerContactId', (patch as any).ownerContactId);
  put('primaryEmail', (patch as any).primaryEmail);
  put('phone', (patch as any).phone);

  // hq: undefined = no change; null = clear; object = JSONB merge
  if ((patch as any).hq !== undefined) {
    const v = (patch as any).hq;
    set.hq =
      v === null
        ? null
        : sql`coalesce(${companies.hq}, '{}'::jsonb) || ${JSON.stringify(v)}::jsonb`;
  }

  // If nothing to update, short-circuit to avoid "SET" being empty
  if (Object.keys(set).length === 1) return true; // only updatedAt present

  const { rowCount } = await db
    .update(companies)
    .set(set)
    .where(eq(companies.id, id));
  return rowCount === 1;
}
export async function deleteCompany(id: string) {
  const { rowCount } = await db.delete(companies).where(eq(companies.id, id));
  return rowCount === 1;
}

/** Helpers used by overview */
export async function contactsForCompany(companyId: string) {
  return db
    .select()
    .from(contacts)
    .where(eq(contacts.companyId, companyId))
    .orderBy(contacts.createdAt);
}
