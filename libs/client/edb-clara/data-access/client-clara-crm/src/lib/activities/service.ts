// data-access/crm/activities/service.ts
import { api } from '../_core/client';
import type {
  Activity,
  CreateActivityInput,
  UpdateActivityInput,
} from './types';

export const fetchActivities = () => api<Activity[]>('/activities');

export const createActivity = (body: CreateActivityInput) =>
  api<Activity>('/activities', { method: 'POST', body: JSON.stringify(body) });

export const patchActivity = (id: string, patch: UpdateActivityInput) =>
  api<Activity>(`/activities/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(patch),
  });

export const deleteActivity = (id: string) =>
  api<void>(`/activities/${id}`, { method: 'DELETE' });

// export const fetchActivitiesForContact = (contactId: string) =>
//   api<Activity[]>(`/contacts/${contactId}/activities`);
