import { useMutation, useQueryClient } from '@tanstack/react-query';
import { companyKeys, taskKeys } from '../../../core/keys';
import { patchTask } from '../../../services';

export function useToggleTask() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ id, next }: { id: string; next: boolean }) =>
      patchTask(id, { done: next }),

    onMutate: async ({ id, next }) => {
      await qc.cancelQueries({ queryKey: taskKeys.list() });
      const prev = qc.getQueryData<any[]>(taskKeys.list()) ?? [];

      // optimistic update list
      qc.setQueryData(taskKeys.list(), (rows: any[] = []) =>
        rows.map((t) => (t.id === id ? { ...t, done: next } : t)),
      );

      return { prev };
    },

    onError: (_err, _vars, ctx) => {
      if (ctx?.prev) qc.setQueryData(taskKeys.list(), ctx.prev);
    },

    onSuccess: (_data, _vars) => {
      // refresh tasks + any company overviews (nextTaskDue/openTasks)
      qc.invalidateQueries({ queryKey: taskKeys.list() });
      qc.invalidateQueries({ queryKey: companyKeys.all });
    },
  });
}
