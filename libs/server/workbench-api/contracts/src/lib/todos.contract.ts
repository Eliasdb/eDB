import { z } from 'zod';

export const TodoId = z.string().uuid();
export const Todo = z.object({
  id: TodoId,
  title: z.string().min(1),
  done: z.boolean().default(false),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export const CreateTodoInput = z.object({
  title: z.string().min(1),
});

export const UpdateTodoInput = z.object({
  title: z.string().min(1).optional(),
  done: z.boolean().optional(),
});

export const GetTodoParams = z.object({ id: TodoId });
export const DeleteTodoParams = z.object({ id: TodoId });

export const ListTodosQuery = z.object({
  limit: z.coerce.number().int().min(1).max(100).default(20),
  offset: z.coerce.number().int().min(0).default(0),
});

export type TodoT = z.infer<typeof Todo>;
export type CreateTodoInputT = z.infer<typeof CreateTodoInput>;
export type UpdateTodoInputT = z.infer<typeof UpdateTodoInput>;
export type GetTodoParamsT = z.infer<typeof GetTodoParams>;
export type ListTodosQueryT = z.infer<typeof ListTodosQuery>;
