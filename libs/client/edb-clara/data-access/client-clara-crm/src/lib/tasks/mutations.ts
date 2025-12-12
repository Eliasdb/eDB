// data-access/crm/tasks/mutations.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { companyKeys } from '../companies/keys';
import { contactKeys } from '../contacts/keys';
import { taskKeys } from './keys';
import { createTask, patchTask } from './service';
import type { CreateTaskInput, UpdateTaskInput } from './types';

export function useCreateTask() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: CreateTaskInput) => createTask(body),
    onSuccess: (created) => {
      qc.invalidateQueries({ queryKey: taskKeys.list() });
      qc.invalidateQueries({ queryKey: taskKeys.byId(created.id) });
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

export function usePatchTask(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (patch: UpdateTaskInput) => patchTask(id, patch),
    onSuccess: (updated) => {
      qc.invalidateQueries({ queryKey: taskKeys.byId(id) });
      qc.invalidateQueries({ queryKey: taskKeys.list() });
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

export function useDeleteTask() {
  const qc = useQueryClient();
  return useMutation({
    // the variable is the ID
    mutationFn: (id: string) =>
      fetch(`/tasks/${id}`, { method: 'DELETE' }).then(() => undefined),
    onSuccess: (_void, id) => {
      qc.invalidateQueries({ queryKey: taskKeys.list() });
      qc.invalidateQueries({ queryKey: taskKeys.byId(id) });
    },
  });
}

/** Convenience: toggle the `done` flag */
export function useToggleTask() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, next }: { id: string; next: boolean }) =>
      patchTask(id, { done: next }),
    onSuccess: (updated) => {
      qc.invalidateQueries({ queryKey: taskKeys.byId(updated.id) });
      qc.invalidateQueries({ queryKey: taskKeys.list() });
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
