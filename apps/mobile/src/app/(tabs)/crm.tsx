// i18n
import { useTranslation } from 'react-i18next';

// API
import {
  useCreateTask,
  useDeleteTask,
  useHub,
  useToggleTask,
} from '@api/hooks';

// React
import { useCallback, useMemo } from 'react';

// Types
import type { HubPayload } from '@api/types';

// UI
import CRMTabs from '@features/crm/components/CRMTabs';

export default function CRMScreen() {
  const { t } = useTranslation();
  const { data, isLoading, isRefetching, refetch, error } = useHub();
  const toggle = useToggleTask();
  const addTask = useCreateTask();
  const delTask = useDeleteTask();

  const hub: HubPayload = useMemo(
    () => data ?? { tasks: [], contacts: [], companies: [] },
    [data],
  );

  const onRefresh = useCallback(() => refetch(), [refetch]);

  return (
    <CRMTabs
      hub={hub}
      isLoading={isLoading}
      isRefreshing={!!isRefetching && !isLoading}
      error={error}
      onRefresh={onRefresh}
      onAddTask={(title) => addTask.mutate({ title })}
      addingTask={addTask.isPending}
      onToggleTask={(id, next) => toggle.mutate({ id, next })}
      onDeleteTask={(id) => delTask.mutate(id)}
    />
  );
}
