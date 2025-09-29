import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Platform, RefreshControl, ScrollView, Text } from 'react-native';

import ResponsiveTabsLayout from '@ui/layout/ResponsiveTabsLayout';
import { Card } from '@ui/primitives/Card';
import EntityRow from '@ui/primitives/EntityRow';
import { List } from '@ui/primitives/List';
import { EmptyLine } from '@ui/primitives/primitives';

import AddTaskInline from '@features/crm/components/AddTaskInline';
import TaskRow from '@features/crm/components/TaskRow';
import TaskEditSheet from '@features/crm/sheets/TaskEditSheet';
import {
  CompanyItemSkeleton,
  ContactItemSkeleton,
  ListSkeleton,
  TaskItemSkeleton,
} from '@features/crm/skeletons/ItemSkeletons';

import {
  companyToEntityProps,
  contactToEntityProps,
} from '@features/crm/mappers/entity';

import type { HubPayload } from '@api/types';

const webPanY = Platform.OS === 'web' ? ({ touchAction: 'pan-y' } as any) : {};

type Tab = 'tasks' | 'contacts' | 'companies';

type Props = {
  hub: HubPayload;
  isLoading: boolean;
  isRefreshing: boolean;
  error?: unknown;
  onRefresh: () => void;

  // task actions
  onAddTask: (title: string) => void;
  addingTask: boolean;
  onToggleTask: (id: string, next: boolean) => void;
  onDeleteTask: (id: string) => void;

  initialTab?: Tab;
};

export default function CRMTabs({
  hub,
  isLoading,
  isRefreshing,
  error,
  onRefresh,
  onAddTask,
  addingTask,
  onToggleTask,
  onDeleteTask,
  initialTab = 'tasks',
}: Props) {
  const { t } = useTranslation();

  const [tab, setTab] = useState<Tab>(initialTab);
  const [editing, setEditing] = useState<HubPayload['tasks'][number] | null>(
    null,
  );

  const handleRefresh = useCallback(() => onRefresh(), [onRefresh]);

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
              refreshing={isRefreshing}
              onRefresh={handleRefresh}
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

          {/* Tasks */}
          {tab === 'tasks' && (
            <Card inset className="gap-1.5">
              <AddTaskInline onAdd={onAddTask} isSaving={addingTask} />

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
                    <List.Item key={task.id} first={i === 0}>
                      <TaskRow
                        task={task}
                        onToggle={() => onToggleTask(task.id, !task.done)}
                        onDelete={() => onDeleteTask(task.id)}
                        onEdit={() => setEditing(task)}
                      />
                    </List.Item>
                  ))}
                </List>
              )}
            </Card>
          )}

          {/* Contacts */}
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
                    <List.Item key={c.id} first={i === 0}>
                      <EntityRow {...contactToEntityProps(c)} />
                    </List.Item>
                  ))}
                </List>
              )}
            </Card>
          )}

          {/* Companies */}
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
                    <List.Item key={co.id} first={i === 0}>
                      <EntityRow {...companyToEntityProps(co)} />
                    </List.Item>
                  ))}
                </List>
              )}
            </Card>
          )}
        </ScrollView>
      </ResponsiveTabsLayout>

      {/* Edit Sheet (kept inside tabs component) */}
      <TaskEditSheet
        visible={!!editing}
        task={editing}
        onClose={() => setEditing(null)}
        onSave={() => {
          // Wire your patch/save call here if needed.
        }}
        onDelete={
          editing
            ? () => {
                onDeleteTask(editing.id);
                setEditing(null);
              }
            : undefined
        }
      />
    </>
  );
}
