import { sql } from 'drizzle-orm';
import { db } from '../../infra/db/client';
import {
  deleteActivity,
  getActivity,
  insertOrUpdateActivity,
  listActivities,
  patchActivity,
} from '../repos/activities.repo';
import {
  contactsForCompany,
  deleteCompany,
  getCompany,
  insertOrUpdateCompany,
  listCompanies,
  patchCompany,
} from '../repos/companies.repo';
import {
  deleteContact,
  getContact,
  insertOrUpdateContact,
  listContacts,
  patchContact,
} from '../repos/contacts.repo';
import {
  deleteTask,
  getTask,
  insertOrUpdateTask,
  listTasks,
  patchTask,
} from '../repos/tasks.repo';
import type {
  Activity,
  Contact,
  Kind,
  Model,
  Patch,
  Task,
} from '../types/crm.types';
import type { IStore } from './types';

export const store: IStore = {
  async list<K extends Kind>(kind: K): Promise<Model[K][]> {
    switch (kind) {
      case 'companies':
        return (await listCompanies()) as any;
      case 'contacts':
        return (await listContacts()) as any;
      case 'activities':
        return (await listActivities()) as any;
      case 'tasks':
        return (await listTasks()) as any;
    }
  },

  async get<K extends Kind>(
    kind: K,
    id: string,
  ): Promise<Model[K] | undefined> {
    switch (kind) {
      case 'companies':
        return (await getCompany(id)) as any;
      case 'contacts':
        return (await getContact(id)) as any;
      case 'activities':
        return (await getActivity(id)) as any;
      case 'tasks':
        return (await getTask(id)) as any;
    }
  },

  async add<K extends Kind>(kind: K, item: Model[K]): Promise<string> {
    switch (kind) {
      case 'companies':
        return await insertOrUpdateCompany(item as any);
      case 'contacts':
        return await insertOrUpdateContact(item as any);
      case 'activities':
        return await insertOrUpdateActivity(item as any);
      case 'tasks':
        return await insertOrUpdateTask(item as any);
    }
  },

  async update<K extends Kind>(
    kind: K,
    id: string,
    patch: Patch[K],
  ): Promise<boolean> {
    switch (kind) {
      case 'companies':
        return await patchCompany(id, patch as any);
      case 'contacts':
        return await patchContact(id, patch as any);
      case 'activities':
        return await patchActivity(id, patch as any);
      case 'tasks':
        return await patchTask(id, patch as any);
    }
  },

  async remove<K extends Kind>(kind: K, id: string): Promise<boolean> {
    switch (kind) {
      case 'companies':
        return await deleteCompany(id);
      case 'contacts':
        return await deleteContact(id);
      case 'activities':
        return await deleteActivity(id);
      case 'tasks':
        return await deleteTask(id);
    }
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
    return (await contactsForCompany(companyId)) as Contact[];
  },

  async activitiesByCompany(companyId: string) {
    const res = await db.execute<Activity>(sql`
    select a.* from activities a
    where a.company_id = ${companyId}
       or (a.contact_id is not null and a.contact_id in (select id from contacts where company_id = ${companyId}))
    order by a.at desc
  `);
    return (res as any).rows as Activity[]; // <-- unwrap rows
  },

  async tasksByCompany(companyId: string) {
    const res = await db.execute<Task>(sql`
    select t.* from tasks t
    where t.company_id = ${companyId}
       or (t.contact_id is not null and t.contact_id in (select id from contacts where company_id = ${companyId}))
    order by coalesce(t.due::text, '') asc
  `);
    return (res as any).rows as Task[]; // <-- unwrap rows
  },
};
