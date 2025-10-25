import { randomUUID } from 'node:crypto';
import type {
  CreateTodoInputT as CreateInputT,
  UpdateTodoInputT as UpdateInputT,
  TodoT as EntityT,
} from '@edb-workbench/api/contracts';
import type { RemindersRepo } from './types';

export function createInMemoryRemindersRepo(): RemindersRepo {
  const rows = new Map<string, EntityT>();

  return {
    async list({ limit, offset }) {
      return Array.from(rows.values()).slice(offset, offset + limit);
    },

    async get(id) {
      return rows.get(id) ?? null;
    },

    async create(input: CreateInputT) {
      const now = new Date().toISOString();
      const entity: EntityT = {
        id: randomUUID(),
        title: (input as any).title ?? '', // <- NOTE: assumes "title"; adapt for your domain
        done: false,
        createdAt: now,
        updatedAt: now,
      };
      rows.set(entity.id, entity);
      return entity;
    },

    async update(id: string, input: UpdateInputT) {
      const existing = rows.get(id);
      if (!existing) return null;

      const updated: EntityT = {
        ...existing,
        ...('title' in input ? { title: (input as any).title! } : {}),
        ...('done' in input ? { done: (input as any).done! } : {}),
        updatedAt: new Date().toISOString(),
      };

      rows.set(id, updated);
      return updated;
    },

    async delete(id: string) {
      return rows.delete(id);
    },
  };
}
