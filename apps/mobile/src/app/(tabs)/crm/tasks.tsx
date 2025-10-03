// app/(tabs)/crm/tasks.tsx
import AddTaskInline from '@features/crm/components/AddTaskInline';
import TaskEditSheet from '@features/crm/sheets/TaskEditSheet';
import {
  ListSkeleton,
  TaskItemSkeleton,
} from '@features/crm/skeletons/ItemSkeletons';
import TaskRow from '@ui/composites/list-rows/task-row/task-row';
import { Card, List } from '@ui/primitives';
import { EmptyLine } from '@ui/primitives/primitives';
import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { RefreshControl, ScrollView } from 'react-native';

import { useCreateTask, useDeleteTask, useHub, useToggleTask } from '@api';

export default function TasksPage() {
  const { t } = useTranslation();
  const { data, isLoading, isRefetching, refetch } = useHub();
  const add = useCreateTask();
  const toggle = useToggleTask();
  const del = useDeleteTask();

  const hub = data ?? { tasks: [], contacts: [], companies: [] };
  const [editing, setEditing] = useState<(typeof hub.tasks)[number] | null>(
    null,
  );

  const onRefresh = useCallback(() => refetch(), [refetch]);

  return (
    <>
      <ScrollView
        className="flex-1 bg-surface dark:bg-surface-dark"
        contentContainerStyle={{ padding: 16, paddingBottom: 28 }}
        refreshControl={
          <RefreshControl
            refreshing={!!isRefetching && !isLoading}
            onRefresh={onRefresh}
          />
        }
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Card
          tone="flat"
          bordered={false}
          inset={false}
          radius="top-none"
          className="overflow-hidden"
        >
          <AddTaskInline
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
                    onEdit={() => setEditing(task)}
                  />
                </List.Item>
              ))}
            </List>
          )}
        </Card>
      </ScrollView>

      <TaskEditSheet
        visible={!!editing}
        task={editing}
        onClose={() => setEditing(null)}
        onSave={() => {}}
        onDelete={
          editing
            ? () => {
                del.mutate(editing.id);
                setEditing(null);
              }
            : undefined
        }
      />
    </>
  );
}
