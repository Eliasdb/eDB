import { api } from '../core/client';
import type { Company, Contact, HubPayload, Task } from '../core/types';

// Queries
export const fetchHub = () => api<HubPayload>('/hub');
export const fetchTasks = () => api<Task[]>('/hub/tasks');
export const fetchContacts = () => api<Contact[]>('/hub/contacts');
export const fetchCompanies = () => api<Company[]>('/hub/companies');

// Mutations (CRUD)
export const createTask = (body: Omit<Task, 'id'>) =>
  api<Task>('/hub/tasks', { method: 'POST', body: JSON.stringify(body) });

export const patchTask = (id: string, patch: Partial<Task>) =>
  api<Task>(`/hub/tasks/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(patch),
  });

export const deleteTask = (id: string) =>
  api<void>(`/hub/tasks/${id}`, { method: 'DELETE' });

export const createContact = (body: Omit<Contact, 'id'>) =>
  api<Contact>('/hub/contacts', { method: 'POST', body: JSON.stringify(body) });

export const patchContact = (id: string, patch: Partial<Contact>) =>
  api<Contact>(`/hub/contacts/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(patch),
  });

export const deleteContact = (id: string) =>
  api<void>(`/hub/contacts/${id}`, { method: 'DELETE' });

export const createCompany = (body: Omit<Company, 'id'>) =>
  api<Company>('/hub/companies', {
    method: 'POST',
    body: JSON.stringify(body),
  });

export const patchCompany = (id: string, patch: Partial<Company>) =>
  api<Company>(`/hub/companies/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(patch),
  });

export const deleteCompany = (id: string) =>
  api<void>(`/hub/companies/${id}`, { method: 'DELETE' });
