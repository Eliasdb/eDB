import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createTask, deleteTask, fetchHub, patchTask } from './hub';
import type { HubPayload, Task } from './types';

export const hubKeys = {
  all: ['hub'] as const,
  tasks: () => [...hubKeys.all, 'tasks'] as const,
  contacts: () => [...hubKeys.all, 'contacts'] as const,
  companies: () => [...hubKeys.all, 'companies'] as const,
};

export function useHub() {
  return useQuery({
    queryKey: hubKeys.all,
    queryFn: fetchHub,
    staleTime: 10_000,
  });
}

// --- Mutations with optimistic updates against the 'hub' snapshot

export function useToggleTask() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, next }: { id: string; next: boolean }) =>
      patchTask(id, { done: next }),
    onMutate: async ({ id, next }) => {
      await qc.cancelQueries({ queryKey: hubKeys.all });
      const prev = qc.getQueryData<HubPayload>(hubKeys.all);

      if (prev) {
        const nextHub: HubPayload = {
          ...prev,
          tasks: prev.tasks.map((t) =>
            t.id === id ? { ...t, done: next } : t,
          ),
        };
        qc.setQueryData(hubKeys.all, nextHub);
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
        const optimistic: Task = {
          id: `opt-${Date.now()}`,
          ...payload,
        };
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

// Chat
import { sendChat } from './chat';
import { type ChatTurn } from './types';

export function useChat() {
  return useMutation({
    mutationFn: (turns: ChatTurn[]) => sendChat(turns),
  });
}

// Tool logs

import { API_BASE } from './client';
import type { ToolLogsPayload } from './types';

export const toolLogKeys = {
  all: ['toolLogs'] as const,
};

export function useToolLogs() {
  return useQuery({
    queryKey: toolLogKeys.all,
    queryFn: async () => {
      const r = await fetch(`${API_BASE}/realtime/tool-logs`);
      if (!r.ok) throw new Error('Failed to fetch tool logs');
      const json = (await r.json()) as ToolLogsPayload;
      return json.items;
    },
    // keep it feeling “live”
    refetchInterval: 3000,
    refetchOnWindowFocus: true,
    staleTime: 1000,
  });
}
