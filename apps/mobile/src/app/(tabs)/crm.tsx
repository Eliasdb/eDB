// apps/mobile/src/app/(tabs)/TasksScreen.tsx
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Platform,
  Pressable,
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

import AddTaskInline from '@features/crm/components/AddTaskInline';
import CompanyRow from '@features/crm/components/CompanyRow';
import ContactRow from '@features/crm/components/ContactRow';
import TaskRow from '@features/crm/components/TaskRow';
import {
  CompanyItemSkeleton,
  ContactItemSkeleton,
  ListSkeleton,
  TaskItemSkeleton,
} from '@features/crm/skeletons/ItemSkeletons';
import { Card } from '@ui';
import TaskEditSheet from '../features/crm/sheets/TaskEditSheet';

const webPanY = Platform.OS === 'web' ? ({ touchAction: 'pan-y' } as any) : {};

// 🔧 demo toggle
const DEMO_SKELETON = true;
const DEMO_DURATION_MS = 1500;

type Tab = 'tasks' | 'contacts' | 'companies';

export default function CRMScreen() {
  const { t } = useTranslation();
  const { data, isLoading, isRefetching, refetch, error } = useHub();
  const toggle = useToggleTask();
  const addTask = useCreateTask();
  const delTask = useDeleteTask();

  const hub: HubPayload = data ?? { tasks: [], contacts: [], companies: [] };

  // Local tab state
  const [tab, setTab] = useState<Tab>('tasks');
  const [editing, setEditing] = useState<HubPayload['tasks'][number] | null>(
    null,
  );

  // 🎬 local demo loader — shows skeletons briefly on mount
  const [demoLoading, setDemoLoading] = useState(DEMO_SKELETON);
  useEffect(() => {
    if (!DEMO_SKELETON) return;
    const t = setTimeout(() => setDemoLoading(false), DEMO_DURATION_MS);
    return () => clearTimeout(t);
  }, []);

  // Pull-to-refresh demo skeleton
  const onRefresh = useCallback(() => {
    if (DEMO_SKELETON) {
      setDemoLoading(true);
      setTimeout(() => setDemoLoading(false), 800);
    }
    refetch();
  }, [refetch]);

  const showLoading = useMemo(
    () => isLoading || demoLoading,
    [isLoading, demoLoading],
  );

  return (
    <>
      <ScrollView
        className="flex-1 bg-surface dark:bg-surface-dark"
        contentContainerStyle={{ padding: 16, paddingBottom: 28, ...webPanY }}
        refreshControl={
          <RefreshControl
            refreshing={!!isRefetching && !showLoading}
            onRefresh={onRefresh}
          />
        }
        keyboardShouldPersistTaps="handled"
        style={webPanY}
        showsVerticalScrollIndicator={false}
      >
        {/* error banner */}
        {error ? (
          <Card inset className="mb-4">
            <Text className="text-red-600 font-bold">{t('crm.loadError')}</Text>
          </Card>
        ) : null}

        {/* Top tabs */}
        <TabsBar value={tab} onChange={setTab} />

        {/* Content for active tab */}
        {tab === 'tasks' && (
          <Card inset className="gap-1.5 mt-3">
            <AddTaskInline
              onAdd={(title) => addTask.mutate({ title })}
              isSaving={addTask.isPending}
            />

            {showLoading ? (
              <ListSkeleton
                rows={3}
                rowHeight={56}
                renderRow={() => <TaskItemSkeleton />}
              />
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
                      onEdit={() => setEditing(task)} // 👈 open sheet
                    />
                  </ListRow>
                ))}
              </List>
            )}
          </Card>
        )}

        {tab === 'contacts' && (
          <Card inset className="gap-1.5 mt-3">
            {showLoading ? (
              <ListSkeleton
                rows={3}
                rowHeight={60}
                renderRow={() => <ContactItemSkeleton />}
              />
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
        )}

        {tab === 'companies' && (
          <Card inset className="gap-1.5 mt-3">
            {showLoading ? (
              <ListSkeleton
                rows={3}
                rowHeight={60}
                renderRow={() => <CompanyItemSkeleton />}
              />
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
        )}
      </ScrollView>
      <TaskEditSheet
        visible={!!editing}
        task={editing}
        onClose={() => setEditing(null)}
        onSave={(patch) => {
          if (!editing) return;
          // optimistic path is already handled by your hooks,
          // but we can call the REST directly or add a dedicated hook:
          // patchTask(editing.id, patch).finally(() => {
          //   setEditing(null);
          // });
        }}
        onDelete={
          editing
            ? () =>
                delTask.mutate(editing.id, {
                  onSettled: () => setEditing(null),
                })
            : undefined
        }
      />
    </>
  );
}

/* ---------------- TabsBar ---------------- */

function TabsBar({
  value,
  onChange,
}: {
  value: 'tasks' | 'contacts' | 'companies';
  onChange: (v: 'tasks' | 'contacts' | 'companies') => void;
}) {
  const items: Array<{ key: typeof value; label: string }> = [
    { key: 'tasks', label: 'Tasks' },
    { key: 'contacts', label: 'Contacts' },
    { key: 'companies', label: 'Companies' },
  ];

  return (
    <View className="rounded-full bg-muted/60 dark:bg-muted-dark/60 p-1 flex-row">
      {items.map((it) => {
        const active = value === it.key;
        return (
          <Pressable
            key={it.key}
            onPress={() => onChange(it.key)}
            className={`flex-1 rounded-full items-center justify-center py-2 ${
              active ? 'bg-white dark:bg-surface-dark shadow-card' : ''
            }`}
            style={{ marginHorizontal: 2 }}
          >
            <Text
              className={`text-[13px] font-semibold ${
                active ? 'text-primary' : 'text-text-dim dark:text-text-dimDark'
              }`}
              numberOfLines={1}
            >
              {it.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
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
    <View className="min-h-[56px] justify-center py-3 px-4">
      <Text className="text-[15px] text-text-dim dark:text-text-dimDark">
        {text}
      </Text>
    </View>
  );
}
