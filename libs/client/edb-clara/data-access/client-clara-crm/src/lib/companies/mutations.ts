// api/crm/companies/mutations.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { companyKeys } from './keys';
import { createCompany } from './service';
import type { CreateCompanyInput } from './types';

export function useCreateCompany() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (body: CreateCompanyInput) => createCompany(body),
    onSuccess: (created) => {
      // use the SERVER response (has id)
      qc.invalidateQueries({ queryKey: companyKeys.list() });
      qc.invalidateQueries({ queryKey: companyKeys.byId(created.id) });
      qc.invalidateQueries({ queryKey: companyKeys.overview(created.id) });
    },
  });
}
