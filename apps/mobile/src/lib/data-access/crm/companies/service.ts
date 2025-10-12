import { api } from '../../core/client';
import { Company, CompanyOverview } from './types';

export const fetchCompanies = () => api<Company[]>('/companies');
export const fetchCompany = (id: string) => api<Company>(`/companies/${id}`);
export const fetchCompanyOverview = (id: string) =>
  api<CompanyOverview>(`/companies/${id}/overview`);

export type CreateCompanyInput = Omit<
  Company,
  'id' | 'createdAt' | 'updatedAt'
>;

export const createCompany = (body: CreateCompanyInput) =>
  api<Company>('/companies', { method: 'POST', body: JSON.stringify(body) });

export const patchCompany = (id: string, patch: Partial<Company>) =>
  api<Company>(`/companies/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(patch),
  });

export const deleteCompany = (id: string) =>
  api<void>(`/companies/${id}`, { method: 'DELETE' });
