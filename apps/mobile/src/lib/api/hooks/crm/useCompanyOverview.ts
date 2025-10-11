import { useQuery } from '@tanstack/react-query';
import { companyKeys } from '../../core/keys';
import { fetchCompanyOverview } from '../../services';

export function useCompanyOverview(id?: string) {
  return useQuery({
    queryKey: id ? companyKeys.overview(id) : companyKeys.overview(''),
    queryFn: () => fetchCompanyOverview(id!),
    enabled: !!id,
    staleTime: 60_000, // overview is fine to cache briefly
  });
}
