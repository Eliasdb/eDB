// app/(tabs)/crm/(features)/tasks/index.tsx
import { useCreateTask, useDeleteTask, useHub, useToggleTask } from '@api';
import { useRouter } from 'expo-router';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { RefreshControl } from 'react-native';

import { AddTaskRow, ListSkeleton, TaskItemSkeleton } from '@features/crm';
import { TaskRow } from '@ui/composites';
import { Screen } from '@ui/layout';
import { Card, EmptyLine, List } from '@ui/primitives';

export default function TasksScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { data, isLoading, isRefetching, refetch } = useHub();
  const add = useCreateTask();
  const toggle = useToggleTask();
  const del = useDeleteTask();

  const hub = data ?? { tasks: [], contacts: [], companies: [] };
  const onRefresh = useCallback(() => refetch(), [refetch]);

  return (
    <Screen
      center={false}
      padding={16}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 28 }}
      refreshControl={
        <RefreshControl
          refreshing={!!isRefetching && !isLoading}
          onRefresh={onRefresh}
        />
      }
    >
      <Card
        tone="flat"
        bordered={false}
        inset={false}
        radius="top-none"
        className="overflow-hidden"
      >
        <AddTaskRow
          onAdd={(title) => add.mutate({ title })}
          isSaving={add.isPending}
        />

        {isLoading ? (
          <ListSkeleton
            rows={3}
            rowHeight={56}
            renderRow={() => <TaskItemSkeleton />}
          />
        ) : hub.tasks.length === 0 ? (
          <EmptyLine
            text={t('crm.emptyTasks', { defaultValue: 'No tasks.' })}
          />
        ) : (
          <List>
            {hub.tasks.map((task, i) => (
              <List.Item key={task.id} first={i === 0}>
                <TaskRow
                  task={task}
                  onToggle={() =>
                    toggle.mutate({ id: task.id, next: !task.done })
                  }
                  onDelete={() => del.mutate(task.id)}
                  onEdit={() =>
                    router.push({
                      pathname: '/(tabs)/crm/(features)/tasks/[id]',
                      params: { id: task.id },
                    })
                  }
                />
              </List.Item>
            ))}
          </List>
        )}
      </Card>
    </Screen>
  );
}
