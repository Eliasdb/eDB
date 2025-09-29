import { useCallback, useState } from 'react';
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
import {
  CompanyItemSkeleton,
  ContactItemSkeleton,
  ListSkeleton,
  TaskItemSkeleton,
} from '@features/crm/skeletons/ItemSkeletons';
import { Card } from '@ui';
import ResponsiveTabsLayout from '@ui/ResponsiveTabsLayout';
import TaskEditSheet from '../features/crm/sheets/TaskEditSheet';

const webPanY = Platform.OS === 'web' ? ({ touchAction: 'pan-y' } as any) : {};

type Tab = 'tasks' | 'contacts' | 'companies';

export default function CRMScreen() {
  const { t } = useTranslation();
  const { data, isLoading, isRefetching, refetch, error } = useHub();
  const toggle = useToggleTask();
  const addTask = useCreateTask();
  const delTask = useDeleteTask();

  const hub: HubPayload = data ?? { tasks: [], contacts: [], companies: [] };

  // Local tab + edit state
  const [tab, setTab] = useState<Tab>('tasks');
  const [editing, setEditing] = useState<HubPayload['tasks'][number] | null>(
    null,
  );

  // Pull-to-refresh handler
  const onRefresh = useCallback(() => {
    refetch();
  }, [refetch]);

  return (
    <>
      <ResponsiveTabsLayout
        tabs={[
          { key: 'tasks', label: t('crm.tasks', { defaultValue: 'Tasks' }) },
          {
            key: 'contacts',
            label: t('crm.contacts', { defaultValue: 'Contacts' }),
          },
          {
            key: 'companies',
            label: t('crm.companies', { defaultValue: 'Companies' }),
          },
        ]}
        value={tab}
        onChange={setTab}
        sidebarTitle="CRM"
        sidebarFooter={
          <Text className="text-[12px] text-text-dim dark:text-text-dimDark">
            Manage tasks, contacts, and companies.
          </Text>
        }
      >
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
          {/* error banner */}
          {error ? (
            <Card inset className="mb-4">
              <Text className="text-red-600 font-bold">
                {t('crm.loadError')}
              </Text>
            </Card>
          ) : null}

          {/* Content for active tab */}
          {tab === 'tasks' && (
            <Card inset className="gap-1.5">
              <AddTaskInline
                onAdd={(title) => addTask.mutate({ title })}
                isSaving={addTask.isPending}
              />

              {isLoading ? (
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
                        onEdit={() => setEditing(task)}
                      />
                    </ListRow>
                  ))}
                </List>
              )}
            </Card>
          )}

          {tab === 'contacts' && (
            <Card inset className="gap-1.5">
              {isLoading ? (
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
            <Card inset className="gap-1.5">
              {isLoading ? (
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
      </ResponsiveTabsLayout>

      {/* Edit Sheet */}
      <TaskEditSheet
        visible={!!editing}
        task={editing}
        onClose={() => setEditing(null)}
        onSave={(patch) => {
          if (!editing) return;
          // You can wire a dedicated hook; for now caller handles optimistic updates.
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
