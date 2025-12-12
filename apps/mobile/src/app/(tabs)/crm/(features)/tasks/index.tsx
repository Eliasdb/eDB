// app/(tabs)/crm/(features)/tasks/index.tsx
import { useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { RefreshControl } from 'react-native';

import {
  AddTaskRow,
  ListSkeleton,
  TaskItemSkeleton,
} from '@edb-clara/feature-crm';

import {
  Card,
  EmptyLine,
  List,
  Screen,
  showContextMenu,
  SwipeableItem,
  TaskRow,
} from '@edb/shared-ui-rn';

// 🆕 data-access imports
import {
  useCreateTask,
  useDeleteTask,
  useTasks,
  useToggleTask,
} from '@edb-clara/client-crm';

export default function TasksScreen() {
  const { t } = useTranslation();
  const router = useRouter();

  // fetch list via React Query
  const { data: tasks = [], isLoading, refetch } = useTasks();

  // mutations
  const add = useCreateTask();
  const toggle = useToggleTask();
  const del = useDeleteTask(); // not used; see inline usage

  /** local-only spinner state for pull-to-refresh */
  const [isRefreshing, setRefreshing] = useState(false);
  const onRefresh = useCallback(async () => {
    try {
      setRefreshing(true);
      await refetch();
    } finally {
      setRefreshing(false);
    }
  }, [refetch]);

  return (
    <Screen
      center={false}
      padding={16}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 28 }}
      refreshControl={
        <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
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
        ) : tasks.length === 0 ? (
          <EmptyLine
            text={t('crm.emptyTasks', { defaultValue: 'No tasks.' })}
          />
        ) : (
          <List>
            {tasks.map((task, i) => (
              <List.Item key={task.id} first={i === 0}>
                <SwipeableItem
                  onDelete={() => del.mutate(task.id)}
                  onLongPressMenu={() =>
                    showContextMenu(
                      'Task',
                      [
                        {
                          label: task.done ? 'Mark as open' : 'Mark as done',
                          key: 'toggle',
                        },
                        { label: 'Edit', key: 'edit' },
                        { label: 'Delete', key: 'delete', destructive: true },
                      ],
                      (key) => {
                        if (key === 'toggle') {
                          toggle.mutate({ id: task.id, next: !task.done });
                        } else if (key === 'edit') {
                          router.push({
                            pathname: '/(tabs)/crm/(features)/tasks/[id]',
                            params: { id: task.id },
                          });
                        } else if (key === 'delete') {
                          del.mutate(task.id);
                        }
                      },
                    )
                  }
                >
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
                </SwipeableItem>
              </List.Item>
            ))}
          </List>
        )}
      </Card>
    </Screen>
  );
}
