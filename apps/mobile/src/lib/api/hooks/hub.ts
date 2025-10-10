import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { hubKeys } from '../core/keys';
import type { Activity, HubPayload, Task } from '../core/types';
import {
  createTask,
  deleteTask,
  fetchActivities,
  fetchCompanyOverview,
  fetchContactOverview,
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
      const optimistic: Task = { id: `opt-${Date.now()}`, ...payload };

      if (prev) {
        // 👇 append so it matches server insertion order
        qc.setQueryData(hubKeys.all, {
          ...prev,
          tasks: [...prev.tasks, optimistic],
        } as HubPayload);
      }
      return { prev, optimisticId: optimistic.id };
    },

    onError: (_e, _v, ctx) => {
      if (ctx?.prev) qc.setQueryData(hubKeys.all, ctx.prev);
    },

    onSuccess: (serverTask, _payload, ctx) => {
      // 👇 replace the optimistic item in-place (no jump)
      const prev = qc.getQueryData<HubPayload>(hubKeys.all);
      if (prev && ctx?.optimisticId) {
        qc.setQueryData(hubKeys.all, {
          ...prev,
          tasks: prev.tasks.map((t) =>
            t.id === ctx.optimisticId ? serverTask : t,
          ),
        } as HubPayload);
      }
    },

    // You can keep this, but it's optional now since onSuccess reconciles the cache.
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

export function useContactOverview(id?: string) {
  return useQuery({
    enabled: !!id,
    queryKey: id ? [...hubKeys.contact, 'overview', id] : ['__noop__'],
    queryFn: () => fetchContactOverview(id as string),
    staleTime: 10_000,
  });
}

// api/hooks.ts (where your other hooks live)
import { createActivity } from '../services/hub';

// api/hooks.ts (or hooks/hub.ts)

export function useCreateActivity({
  contactId,
  companyId,
}: { contactId?: string; companyId?: string } = {}) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (payload: Omit<Activity, 'id'>) => createActivity(payload),

    onMutate: async (payload) => {
      const cid = payload.companyId ?? companyId;
      const pid = payload.contactId ?? contactId;

      // --- Cancel potentially affected queries
      if (pid) {
        await qc.cancelQueries({ queryKey: hubKeys.activities(pid) });
        await qc.cancelQueries({
          queryKey: [...hubKeys.contact, 'overview', pid],
        });
      }
      if (cid) {
        await qc.cancelQueries({ queryKey: hubKeys.companyOverview(cid) });
      }

      // --- Snapshot previous
      const prevActs = pid
        ? qc.getQueryData<Activity[]>(hubKeys.activities(pid))
        : undefined;
      const prevContactOverview = pid
        ? qc.getQueryData<any>([...hubKeys.contact, 'overview', pid])
        : undefined;
      const prevCompanyOverview = cid
        ? qc.getQueryData<any>(hubKeys.companyOverview(cid))
        : undefined;

      // --- Optimistic item
      const optimistic: Activity = {
        id: `opt-${Date.now()}`,
        ...payload,
      };

      // Optimistically update activities(contact) list (if queried)
      if (pid) {
        if (prevActs) {
          qc.setQueryData<Activity[]>(hubKeys.activities(pid), [
            optimistic,
            ...prevActs,
          ]);
        } else {
          qc.setQueryData<Activity[]>(hubKeys.activities(pid), [optimistic]);
        }
      }

      // Optimistically update contact overview cache (what your Contact screen uses)
      if (prevContactOverview) {
        qc.setQueryData([...hubKeys.contact, 'overview', pid!], {
          ...prevContactOverview,
          activities: [optimistic, ...(prevContactOverview.activities ?? [])],
        });
      }

      // Optimistically update company overview (for company timeline + stats)
      if (prevCompanyOverview) {
        qc.setQueryData(hubKeys.companyOverview(cid!), {
          ...prevCompanyOverview,
          activities: [optimistic, ...(prevCompanyOverview.activities ?? [])],
          stats: {
            ...(prevCompanyOverview.stats ?? {}),
            lastActivityAt:
              (prevCompanyOverview.activities?.[0]?.at ?? '') < optimistic.at
                ? optimistic.at
                : (prevCompanyOverview.stats?.lastActivityAt ?? optimistic.at),
          },
        });
      }

      return {
        pid,
        cid,
        prevActs,
        prevContactOverview,
        prevCompanyOverview,
      };
    },

    onError: (_e, _vars, ctx) => {
      if (!ctx) return;
      const { pid, cid, prevActs, prevContactOverview, prevCompanyOverview } =
        ctx;

      if (pid && prevActs) {
        qc.setQueryData(hubKeys.activities(pid), prevActs);
      }
      if (pid && prevContactOverview) {
        qc.setQueryData(
          [...hubKeys.contact, 'overview', pid],
          prevContactOverview,
        );
      }
      if (cid && prevCompanyOverview) {
        qc.setQueryData(hubKeys.companyOverview(cid), prevCompanyOverview);
      }
    },

    onSettled: (_data, _err, vars, ctx) => {
      const pid = vars.contactId ?? ctx?.pid ?? contactId;
      const cid = vars.companyId ?? ctx?.cid ?? companyId;

      // ✅ Invalidate everything that could be showing these activities
      if (pid) {
        qc.invalidateQueries({
          queryKey: hubKeys.activities(pid),
          exact: true,
        });
        qc.invalidateQueries({
          queryKey: [...hubKeys.contact, 'overview', pid],
          exact: true,
        });
      }
      if (cid) {
        qc.invalidateQueries({
          queryKey: hubKeys.companyOverview(cid),
          exact: true,
        });
      }
    },
  });
}
