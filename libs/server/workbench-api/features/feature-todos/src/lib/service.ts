import type { TodosRepo, TodosService } from './types';
import type { CreateTodoInputT, UpdateTodoInputT } from '@edb-workbench/api/contracts';

export function createTodosService(repo: TodosRepo): TodosService {
  return {
    async list(limit, offset) {
      return repo.list({ limit, offset });
    },
    async get(id) {
      const row = await repo.get(id);
      if (!row) throw new Error('NOT_FOUND');
      return row;
    },
    async create(input: CreateTodoInputT) {
      // add rules here if needed
      return repo.create(input);
    },
    async update(id, input: UpdateTodoInputT) {
      const row = await repo.update(id, input);
      if (!row) throw new Error('NOT_FOUND');
      return row;
    },
    async delete(id) {
      const ok = await repo.delete(id);
      if (!ok) throw new Error('NOT_FOUND');
    },
  };
}
