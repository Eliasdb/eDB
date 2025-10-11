// domain/stores/pg.store.ts
import { pool } from '../../infra/db';
import {
  Activity,
  Contact,
  Kind,
  Model,
  Patch,
  Task,
} from '../types/crm.types';
import { IStore } from './types';

// 👇 narrow the table name to a string union
type Table = 'companies' | 'contacts' | 'activities' | 'tasks';

function tableOf(kind: Kind): Table {
  switch (kind) {
    case 'companies':
      return 'companies';
    case 'contacts':
      return 'contacts';
    case 'activities':
      return 'activities';
    case 'tasks':
      return 'tasks';
  }
}

export const pgStore: IStore = {
  async list<K extends Kind>(kind: K): Promise<Model[K][]> {
    const table = tableOf(kind);
    const { rows } = await pool.query(
      `select * from ${table} order by created_at asc`,
    );
    return rows as any;
  },

  async get<K extends Kind>(
    kind: K,
    id: string,
  ): Promise<Model[K] | undefined> {
    const table = tableOf(kind);
    const { rows } = await pool.query(`select * from ${table} where id = $1`, [
      id,
    ]);
    return (rows[0] ?? undefined) as any;
  },

  async add<K extends Kind>(kind: K, item: Model[K]): Promise<string> {
    const table = tableOf(kind);

    // 👇 strongly type the per-table SQL
    const q: Record<Table, { sql: string; vals: any[] }> = {
      companies: {
        sql: `insert into companies (id, name, website, stage)
          values ($1,$2,$3,$4)
          on conflict (id) do update set
            name = excluded.name,
            website = excluded.website,
            stage = excluded.stage,
            updated_at = now()
          returning id`,
        vals: [
          (item as any).id,
          (item as any).name,
          (item as any).website ?? null,
          (item as any).stage ?? null, // 'lead'|'prospect'|'customer'|'inactive' or null
        ],
      },
      contacts: {
        sql: `insert into contacts (id, name, email, phone, company_id) values ($1,$2,$3,$4,$5)
              on conflict (id) do update set name = excluded.name, email = excluded.email, phone = excluded.phone, company_id = excluded.company_id, updated_at = now()
              returning id`,
        vals: [
          (item as any).id,
          (item as any).name,
          (item as any).email ?? null,
          (item as any).phone ?? null,
          (item as any).companyId ?? null,
        ],
      },
      activities: {
        sql: `insert into activities (id, type, summary, contact_id, company_id, at) values ($1,$2,$3,$4,$5,$6)
              on conflict (id) do update set type = excluded.type, summary = excluded.summary, contact_id = excluded.contact_id, company_id = excluded.company_id, at = excluded.at, updated_at = now()
              returning id`,
        vals: [
          (item as any).id,
          (item as any).type,
          (item as any).summary,
          (item as any).contactId ?? null,
          (item as any).companyId ?? null,
          (item as any).at,
        ],
      },
      tasks: {
        sql: `insert into tasks (id, title, done, due, contact_id, company_id) values ($1,$2,$3,$4,$5,$6)
              on conflict (id) do update set title = excluded.title, done = excluded.done, due = excluded.due, contact_id = excluded.contact_id, company_id = excluded.company_id, updated_at = now()
              returning id`,
        vals: [
          (item as any).id,
          (item as any).title,
          !!(item as any).done,
          (item as any).due ?? null,
          (item as any).contactId ?? null,
          (item as any).companyId ?? null,
        ],
      },
    };

    const { sql, vals } = q[table];
    const { rows } = await pool.query(sql, vals);
    const row = rows[0] as { id: string };
    return row.id;
  },

  async update<K extends Kind>(
    kind: K,
    id: string,
    patch: Patch[K],
  ): Promise<boolean> {
    const table = tableOf(kind);
    const allowedCols: Record<Table, string[]> = {
      companies: ['name', 'website', 'stage'], // ← add stage
      contacts: ['name', 'email', 'phone', 'company_id'],
      activities: ['type', 'summary', 'contact_id', 'company_id', 'at'],
      tasks: ['title', 'done', 'due', 'contact_id', 'company_id'],
    };

    const input = { ...patch } as any;
    if ('companyId' in input) {
      input.company_id = input.companyId;
      delete input.companyId;
    }
    if ('contactId' in input) {
      input.contact_id = input.contactId;
      delete input.contactId;
    }

    const cols = allowedCols[table].filter((c) => c in input);
    if (cols.length === 0) return true;

    const sets =
      cols.map((c, i) => `${c} = $${i + 1}`).join(', ') +
      ', updated_at = now()';
    const vals = cols.map((c) => input[c]);
    vals.push(id);

    const { rowCount } = await pool.query(
      `update ${table} set ${sets} where id = $${vals.length}`,
      vals,
    );
    return rowCount === 1;
  },

  async remove<K extends Kind>(kind: K, id: string): Promise<boolean> {
    const table = tableOf(kind);
    const { rowCount } = await pool.query(
      `delete from ${table} where id = $1`,
      [id],
    );
    return rowCount === 1;
  },

  async all() {
    const [tasks, contacts, companies, activities] = await Promise.all([
      this.list('tasks'),
      this.list('contacts'),
      this.list('companies'),
      this.list('activities'),
    ]);
    return { tasks, contacts, companies, activities };
  },

  async contactsByCompany(companyId: string) {
    const { rows } = await pool.query(
      `select * from contacts where company_id = $1 order by created_at asc`,
      [companyId],
    );
    return rows as Contact[];
  },

  async activitiesByCompany(companyId: string) {
    const { rows } = await pool.query(
      `
      select a.*
      from activities a
      where a.company_id = $1
         or (a.contact_id is not null and a.contact_id in (select id from contacts where company_id = $1))
      order by a.at desc
      `,
      [companyId],
    );
    return rows as Activity[];
  },

  async tasksByCompany(companyId: string) {
    const { rows } = await pool.query(
      `
      select t.*
      from tasks t
      where t.company_id = $1
         or (t.contact_id is not null and t.contact_id in (select id from contacts where company_id = $1))
      order by coalesce(t.due::text, '') asc
      `,
      [companyId],
    );
    return rows as Task[];
  },
};
