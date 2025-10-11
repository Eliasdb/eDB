import { api } from '../../core/client';
import type { Task } from '../../core/types';

export const fetchTasks = () => api<Task[]>('/tasks');

export const createTask = (body: Omit<Task, 'id'>) =>
  api<Task>('/tasks', { method: 'POST', body: JSON.stringify(body) });

export const patchTask = (id: string, patch: Partial<Task>) =>
  api<Task>(`/tasks/${id}`, { method: 'PATCH', body: JSON.stringify(patch) });

export const deleteTask = (id: string) =>
  api<void>(`/tasks/${id}`, { method: 'DELETE' });
