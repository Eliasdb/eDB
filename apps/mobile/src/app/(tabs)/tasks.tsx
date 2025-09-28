// apps/mobile/src/app/(tabs)/TasksScreen.tsx
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation();
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
          <Section title={t('crm.tasks')}>
            <AddTaskInline onAdd={() => {}} isSaving />
            {[...Array(3)].map((_, i) => (
              <TaskSkeletonRow key={i} />
            ))}
          </Section>

          <Section title={t('crm.contacts')}>
            {[...Array(2)].map((_, i) => (
              <ContactSkeletonRow key={i} />
            ))}
          </Section>

          <Section title={t('crm.companies')}>
            {[...Array(2)].map((_, i) => (
              <CompanySkeletonRow key={i} />
            ))}
          </Section>
        </>
      ) : error ? (
        <Card className="mb-4">
          <Text className="text-red-600 font-bold">{t('crm.loadError')}</Text>
        </Card>
      ) : (
        <>
          <Section title={t('crm.tasks')}>
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
                  {t('crm.emptyTasks')}
                </Text>
              }
            />
          </Section>

          <Section title={t('crm.contacts')}>
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
                  {t('crm.emptyContacts')}
                </Text>
              }
            />
          </Section>

          <Section title={t('crm.companies')}>
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
                  {t('crm.emptyCompanies')}
                </Text>
              }
            />
          </Section>
        </>
      )}
    </ScrollView>
  );
}
