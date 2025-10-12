// data-access/crm/tasks/service.ts
import { api } from '../../core/client';
import type { CreateTaskInput, Task, UpdateTaskInput } from './types';

export const fetchTasks = () => api<Task[]>('/tasks');

export const createTask = (body: CreateTaskInput) =>
  api<Task>('/tasks', { method: 'POST', body: JSON.stringify(body) });

export const patchTask = (id: string, patch: UpdateTaskInput) =>
  api<Task>(`/tasks/${id}`, { method: 'PATCH', body: JSON.stringify(patch) });

export const deleteTask = (id: string) =>
  api<void>(`/tasks/${id}`, { method: 'DELETE' });

export const fetchTask = (id: string) => api<Task>(`/tasks/${id}`);
