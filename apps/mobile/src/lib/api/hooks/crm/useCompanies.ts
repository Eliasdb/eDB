import { useQuery } from '@tanstack/react-query';
import { companyKeys } from '../../core/keys';
import { fetchCompanies } from '../../services';

export function useCompanies() {
  return useQuery({
    queryKey: companyKeys.list(),
    queryFn: fetchCompanies,
    staleTime: 15_000,
  });
}
