// data-access/crm/companies/cache.ts
import { QueryClient } from '@tanstack/react-query';
import { companyKeys } from './keys';

export const invalidateCompany = (qc: QueryClient, id?: string | null) => {
  if (!id) return;
  qc.invalidateQueries({ queryKey: companyKeys.byId(id) });
  qc.invalidateQueries({ queryKey: companyKeys.overview(id) });
};

export const invalidateCompanyLists = (qc: QueryClient) => {
  qc.invalidateQueries({ queryKey: companyKeys.list() });
};
