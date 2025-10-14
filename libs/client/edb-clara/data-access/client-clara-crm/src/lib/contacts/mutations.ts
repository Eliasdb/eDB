// data-access/crm/contacts/mutations.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { companyKeys } from '../companies/keys';
import { contactKeys } from './keys';
import { createContact, deleteContact, patchContact } from './service';
import type { CreateContactInput, UpdateContactInput } from './types';

export function useCreateContact() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: CreateContactInput) => createContact(body),
    onSuccess: (created) => {
      qc.invalidateQueries({ queryKey: contactKeys.list() });
      qc.invalidateQueries({ queryKey: contactKeys.byId(created.id) });
      qc.invalidateQueries({ queryKey: contactKeys.overview(created.id) });
      if (created.companyId) {
        qc.invalidateQueries({
          queryKey: companyKeys.overview(created.companyId),
        });
      }
    },
  });
}

export function usePatchContact(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (patch: UpdateContactInput) => patchContact(id, patch),
    onSuccess: (updated) => {
      qc.invalidateQueries({ queryKey: contactKeys.byId(id) });
      qc.invalidateQueries({ queryKey: contactKeys.overview(id) });
      if (updated.companyId) {
        qc.invalidateQueries({
          queryKey: companyKeys.overview(updated.companyId),
        });
      }
    },
  });
}

export function useDeleteContact(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => deleteContact(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: contactKeys.list() });
      qc.invalidateQueries({ queryKey: contactKeys.byId(id) });
      qc.invalidateQueries({ queryKey: contactKeys.overview(id) });
    },
  });
}
