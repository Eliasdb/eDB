import type {
  CreateTodoInputT as CreateInputT,
  UpdateTodoInputT as UpdateInputT,
} from '@edb-workbench/api/contracts';
import type { RemindersRepo, RemindersService } from './types';

export function createRemindersService(repo: RemindersRepo): RemindersService {
  return {
    async list(limit, offset) {
      return repo.list({ limit, offset });
    },

    async get(id) {
      const row = await repo.get(id);
      if (!row) throw new Error('NOT_FOUND');
      return row;
    },

    async create(input: CreateInputT) {
      // Add any domain rules/validation here before saving
      return repo.create(input);
    },

    async update(id, input: UpdateInputT) {
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
