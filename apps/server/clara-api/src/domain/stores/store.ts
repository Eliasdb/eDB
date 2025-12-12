// domain/stores/memory.store.ts
import {
  Activity,
  Company,
  Contact,
  Kind,
  Model,
  Patch,
  Task,
} from '../types/crm.types';
import { IStore } from './types';

const mem = {
  tasks: new Map<string, Task>(),
  contacts: new Map<string, Contact>(),
  companies: new Map<string, Company>(),
  activities: new Map<string, Activity>(),
};

export const memoryStore: IStore = {
  async list<K extends Kind>(kind: K) {
    return [...mem[kind].values()] as Model[K][];
  },
  async get<K extends Kind>(kind: K, id: string) {
    return mem[kind].get(id) as Model[K] | undefined;
  },
  async add<K extends Kind>(kind: K, item: Model[K]) {
    mem[kind].set((item as any).id, item as any);
    return (item as any).id;
  },
  async update<K extends Kind>(kind: K, id: string, patch: Patch[K]) {
    const cur = mem[kind].get(id) as Model[K] | undefined;
    if (!cur) return false;
    mem[kind].set(id, { ...cur, ...patch, id } as any);
    return true;
  },
  async remove<K extends Kind>(kind: K, id: string) {
    return mem[kind].delete(id);
  },

  async all() {
    return {
      tasks: await this.list('tasks'),
      contacts: await this.list('contacts'),
      companies: await this.list('companies'),
      activities: await this.list('activities'),
    };
  },

  async contactsByCompany(companyId: string) {
    return (await this.list('contacts')).filter(
      (c) => c.companyId === companyId,
    );
  },

  async activitiesByCompany(companyId: string) {
    const contactIds = new Set(
      (await this.contactsByCompany(companyId)).map((c) => c.id),
    );
    return (await this.list('activities')).filter(
      (a) =>
        a.companyId === companyId ||
        (a.contactId && contactIds.has(a.contactId)),
    );
  },

  async tasksByCompany(companyId: string) {
    const contactIds = new Set(
      (await this.contactsByCompany(companyId)).map((c) => c.id),
    );
    return (await this.list('tasks')).filter(
      (t) =>
        t.companyId === companyId ||
        (t.contactId && contactIds.has(t.contactId)),
    );
  },
};
