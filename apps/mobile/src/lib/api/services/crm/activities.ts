import { api } from '../../core/client';
import type { Activity } from '../../core/types';

export const fetchActivities = () => api<Activity[]>('/activities');

export const createActivity = (body: Omit<Activity, 'id'>) =>
  api<Activity>('/activities', { method: 'POST', body: JSON.stringify(body) });

export const patchActivity = (id: string, patch: Partial<Activity>) =>
  api<Activity>(`/activities/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(patch),
  });

export const deleteActivity = (id: string) =>
  api<void>(`/activities/${id}`, { method: 'DELETE' });
