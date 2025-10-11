import { api } from '../../core/client';
import type { Activity, Contact, ContactOverview } from '../../core/types';

export const fetchContacts = () => api<Contact[]>('/contacts');
export const fetchContact = (id: string) => api<Contact>(`/contacts/${id}`);
export const fetchContactOverview = (id: string) =>
  api<ContactOverview>(`/contacts/${id}/overview`);
export const fetchActivitiesForContact = (id: string) =>
  api<Activity[]>(`/contacts/${id}/activities`);

export const createContact = (body: Omit<Contact, 'id'>) =>
  api<Contact>('/contacts', { method: 'POST', body: JSON.stringify(body) });

export const patchContact = (id: string, patch: Partial<Contact>) =>
  api<Contact>(`/contacts/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(patch),
  });

export const deleteContact = (id: string) =>
  api<void>(`/contacts/${id}`, { method: 'DELETE' });
