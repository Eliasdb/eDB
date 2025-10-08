// domain/stores/store.ts
import {
  Activity,
  Company,
  Contact,
  Kind,
  Model,
  Patch,
  Task,
} from '../types/crm.types';

const mem = {
  tasks: new Map<string, Task>(),
  contacts: new Map<string, Contact>(),
  companies: new Map<string, Company>(),
  activities: new Map<string, Activity>(),
};

export const store = {
  /* ========== CRUD ========== */
  list<K extends Kind>(kind: K): Model[K][] {
    return [...mem[kind].values()] as Model[K][];
  },

  get<K extends Kind>(kind: K, id: string): Model[K] | undefined {
    return mem[kind].get(id) as Model[K] | undefined;
  },

  add<K extends Kind>(kind: K, item: Model[K]): string {
    // assume id already assigned upstream (route assigns uid if missing)
    mem[kind].set((item as any).id, item as any);
    return (item as any).id;
  },

  update<K extends Kind>(kind: K, id: string, patch: Patch[K]): boolean {
    const cur = mem[kind].get(id) as Model[K] | undefined;
    if (!cur) return false;
    const next = { ...cur, ...patch, id } as Model[K];
    mem[kind].set(id, next as any);
    return true;
  },

  remove<K extends Kind>(kind: K, id: string): boolean {
    return mem[kind].delete(id);
  },

  all() {
    return {
      tasks: this.list('tasks'),
      contacts: this.list('contacts'),
      companies: this.list('companies'),
      activities: this.list('activities'),
    };
  },

  clearAll() {
    mem.tasks.clear();
    mem.contacts.clear();
    mem.companies.clear();
    mem.activities.clear();
  },

  /* ========== Relationship helpers (for Company screen) ========== */
  contactsByCompany(companyId: string) {
    return this.list('contacts').filter((c) => c.companyId === companyId);
  },

  activitiesByCompany(companyId: string) {
    const contactIds = new Set(
      this.contactsByCompany(companyId).map((c) => c.id),
    );
    return this.list('activities').filter((a) => {
      const byCompany = a.companyId === companyId;
      const byContact = a.contactId ? contactIds.has(a.contactId) : false;
      return byCompany || byContact;
    });
  },

  tasksByCompany(companyId: string) {
    const contactIds = new Set(
      this.contactsByCompany(companyId).map((c) => c.id),
    );
    return this.list('tasks').filter((t) => {
      const byCompany = t.companyId === companyId;
      const byContact = t.contactId ? contactIds.has(t.contactId) : false;
      return byCompany || byContact;
    });
  },
};
