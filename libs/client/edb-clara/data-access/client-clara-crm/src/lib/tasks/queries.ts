// data-access/crm/tasks/queries.ts
import { useQuery } from '@tanstack/react-query';
import { taskKeys } from './keys';
import { fetchTask, fetchTasks } from './service';

export function useTasks() {
  return useQuery({
    queryKey: taskKeys.list(),
    queryFn: fetchTasks,
    staleTime: 10_000,
  });
}

export function useTask(id?: string) {
  const enabled = !!id;
  const taskId = id ?? '';
  return useQuery({
    queryKey: taskKeys.byId(taskId),
    queryFn: () => fetchTask(taskId),
    enabled,
  });
}
