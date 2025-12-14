// api/crm/companies/queries.ts
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { companyKeys } from './keys';
import { fetchCompanies, fetchCompanyOverview } from './service';

export function useCompanies() {
  return useQuery({
    queryKey: companyKeys.list(),
    queryFn: fetchCompanies,
    staleTime: 15_000,
  });
}

export function useCompanyOverview(id?: string) {
  const enabled = Boolean(id);
  const companyId = id ?? '';
  return useQuery({
    queryKey: companyKeys.overview(companyId),
    queryFn: () => fetchCompanyOverview(companyId),
    enabled,
    staleTime: 60_000,
  });
}

// handy prefetch utility
export function usePrefetchCompanyOverview() {
  const qc = useQueryClient();
  return (id: string) =>
    qc.prefetchQuery({
      queryKey: companyKeys.overview(id),
      queryFn: () => fetchCompanyOverview(id),
      staleTime: 15_000,
    });
}
