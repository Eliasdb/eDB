import { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { CRMTabs } from '@features/crm';

import type { HubPayload } from '@api';
import { useCreateTask, useDeleteTask, useHub, useToggleTask } from '@api';

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
