// data-access/crm/activities/mutations.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { companyKeys } from '../companies/keys';
import { contactKeys } from '../contacts/keys';
import { activityKeys } from './keys';
import { createActivity, deleteActivity, patchActivity } from './service';
import type { CreateActivityInput, UpdateActivityInput } from './types';

// data-access/crm/activities/mutations.ts

type Defaults = { contactId?: string | null; companyId?: string | null };

export function useCreateActivity(defaults?: Defaults) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: CreateActivityInput) =>
      createActivity({ ...defaults, ...body }),
    onSuccess: (created) => {
      qc.invalidateQueries({ queryKey: activityKeys.list() });
      qc.invalidateQueries({ queryKey: activityKeys.byId(created.id) });
      if (created.contactId)
        qc.invalidateQueries({
          queryKey: activityKeys.byContact(created.contactId),
        });
      if (created.companyId)
        qc.invalidateQueries({
          queryKey: companyKeys.overview(created.companyId),
        });
      if (created.contactId)
        qc.invalidateQueries({
          queryKey: contactKeys.overview(created.contactId),
        });
    },
  });
}

export function usePatchActivity(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (patch: UpdateActivityInput) => patchActivity(id, patch),
    onSuccess: (updated) => {
      qc.invalidateQueries({ queryKey: activityKeys.byId(id) });
      qc.invalidateQueries({ queryKey: activityKeys.list() });
      if (updated.contactId)
        qc.invalidateQueries({
          queryKey: activityKeys.byContact(updated.contactId),
        });
      if (updated.companyId)
        qc.invalidateQueries({
          queryKey: companyKeys.overview(updated.companyId),
        });
      if (updated.contactId)
        qc.invalidateQueries({
          queryKey: contactKeys.overview(updated.contactId),
        });
    },
  });
}

export function useDeleteActivity(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => deleteActivity(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: activityKeys.list() });
      qc.invalidateQueries({ queryKey: activityKeys.byId(id) });
      // list-by-contact will refresh on next focus/refetch; add targeted invalidation if you have the contactId in scope
    },
  });
}
