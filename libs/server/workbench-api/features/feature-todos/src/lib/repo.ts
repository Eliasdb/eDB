import type {
  CreateTodoInputT,
  TodoT,
  UpdateTodoInputT,
} from '@edb-workbench/api/contracts';
import { randomUUID } from 'node:crypto';
import { TodosRepo } from './types';

export function createInMemoryTodosRepo(): TodosRepo {
  const rows = new Map<string, TodoT>();

  return {
    async list({ limit, offset }) {
      return Array.from(rows.values()).slice(offset, offset + limit);
    },
    async get(id) {
      return rows.get(id) ?? null;
    },
    async create(input: CreateTodoInputT) {
      const now = new Date().toISOString();
      const todo: TodoT = {
        id: randomUUID(),
        title: input.title,
        done: false,
        createdAt: now,
        updatedAt: now,
      };
      rows.set(todo.id, todo);
      return todo;
    },
    async update(id: string, input: UpdateTodoInputT) {
      const existing = rows.get(id);
      if (!existing) return null;
      const updated: TodoT = {
        ...existing,
        ...('title' in input ? { title: input.title! } : {}),
        ...('done' in input ? { done: input.done! } : {}),
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
