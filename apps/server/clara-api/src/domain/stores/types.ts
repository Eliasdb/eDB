// domain/stores/types.ts
import {
  Activity,
  Company,
  Contact,
  Kind,
  Model,
  Patch,
  Task,
} from '../types/crm.types';

export interface IStore {
  list<K extends Kind>(kind: K): Promise<Model[K][]>;
  get<K extends Kind>(kind: K, id: string): Promise<Model[K] | undefined>;
  add<K extends Kind>(kind: K, item: Model[K]): Promise<string>;
  update<K extends Kind>(
    kind: K,
    id: string,
    patch: Patch[K],
  ): Promise<boolean>;
  remove<K extends Kind>(kind: K, id: string): Promise<boolean>;

  // helpers
  all(): Promise<{
    tasks: Task[];
    contacts: Contact[];
    companies: Company[];
    activities: Activity[];
  }>;
  contactsByCompany(companyId: string): Promise<Contact[]>;
  activitiesByCompany(companyId: string): Promise<Activity[]>;
  tasksByCompany(companyId: string): Promise<Task[]>;
}
