import type {
  CreateTodoInputT as CreateInputT,
  UpdateTodoInputT as UpdateInputT,
  TodoT as EntityT,
} from '@edb-workbench/api/contracts';

/**
 * Repo is the "data access" layer.
 * Can start in-memory and later move to Postgres/Drizzle/etc.
 */
export interface RemindersRepo {
  list(params: { limit: number; offset: number }): Promise<EntityT[]>;
  get(id: string): Promise<EntityT | null>;
  create(input: CreateInputT): Promise<EntityT>;
  update(id: string, input: UpdateInputT): Promise<EntityT | null>;
  delete(id: string): Promise<boolean>;
}

/**
 * Service is business logic / validation / orchestration.
 * Controller talks to Service, NOT directly to Repo.
 */
export interface RemindersService {
  list(limit: number, offset: number): Promise<EntityT[]>;
  get(id: string): Promise<EntityT>;
  create(input: CreateInputT): Promise<EntityT>;
  update(id: string, input: UpdateInputT): Promise<EntityT>;
  delete(id: string): Promise<void>;
}
