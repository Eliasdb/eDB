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
  return useQuery({
    queryKey: enabled ? taskKeys.byId(id!) : taskKeys.byId(''),
    queryFn: () => fetchTask(id!),
    enabled,
  });
}
