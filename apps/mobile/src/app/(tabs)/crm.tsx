// apps/mobile/src/app/(tabs)/TasksScreen.tsx
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Platform, RefreshControl, ScrollView, Text, View } from 'react-native';

import {
  useCreateTask,
  useDeleteTask,
  useHub,
  useToggleTask,
} from '../../lib/api/hooks';

import type { HubPayload } from '../../lib/api/types';

import AddTaskInline from '@features/crm/components/AddTaskInline';
import CompanyRow from '@features/crm/components/CompanyRow';
import ContactRow from '@features/crm/components/ContactRow';
import TaskRow from '@features/crm/components/TaskRow';
import { Card, Section } from '@ui';

const webPanY = Platform.OS === 'web' ? ({ touchAction: 'pan-y' } as any) : {};

export default function CRMScreen() {
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
      contentContainerStyle={{ padding: 16, paddingBottom: 28, ...webPanY }}
      refreshControl={
        <RefreshControl
          refreshing={!!isRefetching && !isLoading}
          onRefresh={onRefresh}
        />
      }
      keyboardShouldPersistTaps="handled"
      style={webPanY}
      showsVerticalScrollIndicator={false}
    >
      {error ? (
        <Card inset className="mb-4">
          <Text className="text-red-600 font-bold">{t('crm.loadError')}</Text>
        </Card>
      ) : null}

      {/* Tasks */}
      <Section title={t('crm.tasks')}>
        <Card inset className="gap-1.5">
          <AddTaskInline
            onAdd={(title) => addTask.mutate({ title })}
            isSaving={addTask.isPending}
          />

          {isLoading ? (
            <SkeletonList rows={3} />
          ) : hub.tasks.length === 0 ? (
            <EmptyLine text={t('crm.emptyTasks')} />
          ) : (
            <List>
              {hub.tasks.map((task, i) => (
                <ListRow key={task.id} first={i === 0}>
                  <TaskRow
                    task={task}
                    onToggle={() =>
                      toggle.mutate({ id: task.id, next: !task.done })
                    }
                    onDelete={() => delTask.mutate(task.id)}
                    onEdit={() => {}}
                  />
                </ListRow>
              ))}
            </List>
          )}
        </Card>
      </Section>

      {/* Contacts */}
      <Section title={t('crm.contacts')}>
        <Card inset className="gap-1.5">
          {isLoading ? (
            <SkeletonList rows={2} />
          ) : hub.contacts.length === 0 ? (
            <EmptyLine text={t('crm.emptyContacts')} />
          ) : (
            <List>
              {hub.contacts.map((c, i) => (
                <ListRow key={c.id} first={i === 0}>
                  <ContactRow c={c} onEdit={() => {}} />
                </ListRow>
              ))}
            </List>
          )}
        </Card>
      </Section>

      {/* Companies */}
      <Section title={t('crm.companies')}>
        <Card inset className="gap-1.5">
          {isLoading ? (
            <SkeletonList rows={2} />
          ) : hub.companies.length === 0 ? (
            <EmptyLine text={t('crm.emptyCompanies')} />
          ) : (
            <List>
              {hub.companies.map((co, i) => (
                <ListRow key={co.id} first={i === 0}>
                  <CompanyRow co={co} onEdit={() => {}} />
                </ListRow>
              ))}
            </List>
          )}
        </Card>
      </Section>
    </ScrollView>
  );
}

/* ---------- small helpers (local to screen) ---------- */

function List({ children }: { children: React.ReactNode }) {
  return <View className="rounded-xl overflow-hidden">{children}</View>;
}
function ListRow({
  children,
  first,
}: {
  children: React.ReactNode;
  first?: boolean;
}) {
  return (
    <View
      className={first ? '' : 'border-t border-border dark:border-border-dark'}
    >
      {children}
    </View>
  );
}
function EmptyLine({ text }: { text: string }) {
  return (
    <View className="min-h-[48px] justify-center py-3 px-4">
      <Text className="text-[15px] text-text-dim dark:text-text-dimDark">
        {text}
      </Text>
    </View>
  );
}
function SkeletonList({ rows }: { rows: number }) {
  return (
    <View>
      {Array.from({ length: rows }).map((_, i) => (
        <View
          key={i}
          className={`h-[56px] bg-muted/60 dark:bg-muted-dark/60 ${
            i === 0 ? 'rounded-t-xl' : ''
          } ${i === rows - 1 ? 'rounded-b-xl' : ''}`}
          style={
            i > 0
              ? { borderTopWidth: 1, borderColor: 'rgba(0,0,0,0.06)' }
              : undefined
          }
        />
      ))}
    </View>
  );
}
