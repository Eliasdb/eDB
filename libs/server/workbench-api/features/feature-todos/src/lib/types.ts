import type {
  CreateTodoInputT,
  TodoT,
  UpdateTodoInputT,
} from '@edb-workbench/api/contracts';

export interface TodosRepo {
  list(params: { limit: number; offset: number }): Promise<TodoT[]>;
  get(id: string): Promise<TodoT | null>;
  create(input: CreateTodoInputT): Promise<TodoT>;
  update(id: string, input: UpdateTodoInputT): Promise<TodoT | null>;
  delete(id: string): Promise<boolean>;
}

export interface TodosService {
  list(limit: number, offset: number): Promise<TodoT[]>;
  get(id: string): Promise<TodoT>;
  create(input: CreateTodoInputT): Promise<TodoT>;
  update(id: string, input: UpdateTodoInputT): Promise<TodoT>;
  delete(id: string): Promise<void>;
}
