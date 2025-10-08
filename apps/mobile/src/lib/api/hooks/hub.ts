import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { hubKeys } from '../core/keys';
import type { Activity, HubPayload, Task } from '../core/types';
import {
  createTask,
  deleteTask,
  fetchActivities,
  fetchCompanyOverview,
  fetchHub,
  patchTask,
} from '../services/hub';

export function useHub() {
  return useQuery({
    queryKey: hubKeys.all,
    queryFn: fetchHub,
    staleTime: 10_000,
  });
}

export function useToggleTask() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, next }: { id: string; next: boolean }) =>
      patchTask(id, { done: next }),
    onMutate: async ({ id, next }) => {
      await qc.cancelQueries({ queryKey: hubKeys.all });
      const prev = qc.getQueryData<HubPayload>(hubKeys.all);
      if (prev) {
        qc.setQueryData(hubKeys.all, {
          ...prev,
          tasks: prev.tasks.map((t) =>
            t.id === id ? { ...t, done: next } : t,
          ),
        } satisfies HubPayload);
      }
      return { prev };
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.prev) qc.setQueryData(hubKeys.all, ctx.prev);
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: hubKeys.all });
    },
  });
}

export function useCreateTask() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: Omit<Task, 'id'>) => createTask(payload),
    onMutate: async (payload) => {
      await qc.cancelQueries({ queryKey: hubKeys.all });
      const prev = qc.getQueryData<HubPayload>(hubKeys.all);
      if (prev) {
        const optimistic: Task = { id: `opt-${Date.now()}`, ...payload };
        qc.setQueryData(hubKeys.all, {
          ...prev,
          tasks: [optimistic, ...prev.tasks],
        } as HubPayload);
      }
      return { prev };
    },
    onError: (_e, _v, ctx) => {
      if (ctx?.prev) qc.setQueryData(hubKeys.all, ctx.prev);
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: hubKeys.all });
    },
  });
}

export function useDeleteTask() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteTask(id),
    onMutate: async (id) => {
      await qc.cancelQueries({ queryKey: hubKeys.all });
      const prev = qc.getQueryData<HubPayload>(hubKeys.all);
      if (prev) {
        qc.setQueryData(hubKeys.all, {
          ...prev,
          tasks: prev.tasks.filter((t) => t.id !== id),
        } as HubPayload);
      }
      return { prev };
    },
    onError: (_e, _v, ctx) => {
      if (ctx?.prev) qc.setQueryData(hubKeys.all, ctx.prev);
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: hubKeys.all });
    },
  });
}

/** ✅ Focused hook for the single-company screen */
export function useCompanyOverview(id?: string) {
  return useQuery({
    enabled: !!id,
    queryKey: id ? hubKeys.companyOverview(id) : ['__noop__'],
    queryFn: () => fetchCompanyOverview(id as string),
    staleTime: 10_000,
  });
}

export function useContactActivities(contactId?: string) {
  return useQuery({
    enabled: !!contactId,
    queryKey: hubKeys.activities(contactId),
    queryFn: () => fetchActivities(contactId),
    select: (rows: Activity[]) =>
      [...rows].sort((a, b) => b.at.localeCompare(a.at)),
    staleTime: 10_000,
  });
}
