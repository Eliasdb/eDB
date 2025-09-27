// apps/mobile/src/app/(tabs)/TasksScreen.tsx
import { useCallback } from 'react';
import {
  FlatList,
  Platform,
  RefreshControl,
  ScrollView,
  Text,
  View,
} from 'react-native';

import {
  useCreateTask,
  useDeleteTask,
  useHub,
  useToggleTask,
} from '../../lib/api/hooks';

import type { HubPayload } from '../../lib/api/types';

import AddTaskInline from '@features/tasks/components/AddTaskInline';
import CompanyRow from '@features/tasks/components/CompanyRow';
import ContactRow from '@features/tasks/components/ContactRow';
import TaskRow from '@features/tasks/components/TaskRow';

import {
  CompanySkeletonRow,
  ContactSkeletonRow,
  TaskSkeletonRow,
} from '@features/tasks/skeletons/Rows';

import { Card, Section } from '@ui';

const webPanY = Platform.OS === 'web' ? ({ touchAction: 'pan-y' } as any) : {};

export default function TasksScreen() {
  const { data, isLoading, isRefetching, refetch, error } = useHub();
  const toggle = useToggleTask();
  const addTask = useCreateTask();
  const delTask = useDeleteTask();

  const hub: HubPayload = data ?? { tasks: [], contacts: [], companies: [] };
  const onRefresh = useCallback(() => refetch(), [refetch]);

  return (
    <ScrollView
      className="flex-1 bg-surface dark:bg-surface-dark"
      contentContainerStyle={{ padding: 16, paddingBottom: 24, ...webPanY }}
      refreshControl={
        <RefreshControl
          refreshing={!!isRefetching && !isLoading}
          onRefresh={onRefresh}
        />
      }
      keyboardShouldPersistTaps="handled"
      style={webPanY}
    >
      {isLoading ? (
        <>
          <Section title="Tasks">
            <AddTaskInline onAdd={() => {}} isSaving />
            {[...Array(3)].map((_, i) => (
              <TaskSkeletonRow key={i} />
            ))}
          </Section>

          <Section title="Contacts">
            {[...Array(2)].map((_, i) => (
              <ContactSkeletonRow key={i} />
            ))}
          </Section>

          <Section title="Companies">
            {[...Array(2)].map((_, i) => (
              <CompanySkeletonRow key={i} />
            ))}
          </Section>
        </>
      ) : error ? (
        <Card className="mb-4">
          <Text className="text-red-600 font-bold">Couldn’t load hub</Text>
        </Card>
      ) : (
        <>
          <Section title="Tasks">
            <AddTaskInline
              onAdd={(title) => addTask.mutate({ title })}
              isSaving={addTask.isPending}
            />
            <FlatList
              data={hub.tasks}
              keyExtractor={(t) => t.id}
              scrollEnabled={false}
              contentContainerStyle={webPanY}
              ItemSeparatorComponent={() => (
                <View className="h-px bg-border dark:bg-border-dark ml-[46]" />
              )}
              renderItem={({ item }) => (
                <TaskRow
                  task={item}
                  onToggle={() =>
                    toggle.mutate({ id: item.id, next: !item.done })
                  }
                  onDelete={() => delTask.mutate(item.id)}
                />
              )}
              ListEmptyComponent={
                <Text className="text-text-dim dark:text-text-dimDark py-3">
                  No tasks yet — Clara will drop them here.
                </Text>
              }
            />
          </Section>

          <Section title="Contacts">
            <FlatList
              data={hub.contacts}
              keyExtractor={(c) => c.id}
              scrollEnabled={false}
              contentContainerStyle={webPanY}
              ItemSeparatorComponent={() => (
                <View className="h-px bg-border dark:bg-border-dark ml-[46]" />
              )}
              renderItem={({ item }) => <ContactRow c={item} />}
              ListEmptyComponent={
                <Text className="text-text-dim dark:text-text-dimDark py-3">
                  No contacts yet — Clara will place them here.
                </Text>
              }
            />
          </Section>

          <Section title="Companies">
            <FlatList
              data={hub.companies}
              keyExtractor={(c) => c.id}
              scrollEnabled={false}
              contentContainerStyle={webPanY}
              ItemSeparatorComponent={() => (
                <View className="h-px bg-border dark:bg-border-dark ml-[46]" />
              )}
              renderItem={({ item }) => <CompanyRow co={item} />}
              ListEmptyComponent={
                <Text className="text-text-dim dark:text-text-dimDark py-3">
                  No companies yet — Clara will link them here.
                </Text>
              }
            />
          </Section>
        </>
      )}
    </ScrollView>
  );
}
