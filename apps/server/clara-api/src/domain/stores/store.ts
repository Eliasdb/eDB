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
  activities: new Map<string, Activity>(), // 👈 new collection
};

export const store = {
  list<K extends Kind>(kind: K): Model[K][] {
    return [...mem[kind].values()] as Model[K][];
  },

  get<K extends Kind>(kind: K, id: string): Model[K] | undefined {
    return mem[kind].get(id) as Model[K] | undefined;
  },

  add<K extends Kind>(kind: K, item: Model[K]): string {
    mem[kind].set(item.id, item as any);
    return item.id;
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
      activities: this.list('activities'), // 👈 include activities
    };
  },

  clearAll() {
    mem.tasks.clear();
    mem.contacts.clear();
    mem.companies.clear();
    mem.activities.clear(); // 👈
  },
};
