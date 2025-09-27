import { useCallback } from 'react';
import {
  FlatList,
  Platform,
  RefreshControl,
  ScrollView,
  StyleSheet,
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
      style={[styles.screen, webPanY]}
      contentContainerStyle={[{ padding: 16, paddingBottom: 24 }, webPanY]}
      refreshControl={
        <RefreshControl
          refreshing={!!isRefetching && !isLoading}
          onRefresh={onRefresh}
        />
      }
      keyboardShouldPersistTaps="handled"
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
        <Card style={{ marginBottom: 16 }}>
          <Text style={{ color: '#d00', fontWeight: '700' }}>
            Couldn’t load hub
          </Text>
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
              ItemSeparatorComponent={() => <View style={styles.sep} />}
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
                <Text style={styles.empty}>
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
              ItemSeparatorComponent={() => <View style={styles.sep} />}
              renderItem={({ item }) => <ContactRow c={item} />}
              ListEmptyComponent={
                <Text style={styles.empty}>
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
              ItemSeparatorComponent={() => <View style={styles.sep} />}
              renderItem={({ item }) => <CompanyRow co={item} />}
              ListEmptyComponent={
                <Text style={styles.empty}>
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

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#f6f7fb' },
  sep: { height: 1, backgroundColor: '#f0f1f4', marginLeft: 46 },
  empty: { color: '#8b9098', paddingVertical: 12 },
});
