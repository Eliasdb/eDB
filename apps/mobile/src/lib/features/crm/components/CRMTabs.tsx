import { useCallback, useMemo, useState } from 'react';
import { Platform, RefreshControl, ScrollView, Text } from 'react-native';

import { useTranslation } from 'react-i18next';

import TaskRow from '@ui/composites/list-rows/task-row/task-row';
import { ResponsiveTabsLayout } from '@ui/layout';
import { Card, List } from '@ui/primitives';
import { EmptyLine } from '@ui/primitives/primitives';
import { companyToEntityProps, contactToEntityProps } from '../mappers/entity';
import TaskEditSheet from '../sheets/TaskEditSheet';
import {
  CompanyItemSkeleton,
  ContactItemSkeleton,
  ListSkeleton,
  TaskItemSkeleton,
} from '../skeletons/ItemSkeletons';
import AddTaskInline from './AddTaskInline';

// 🎯 Charts & Calendar
import { TasksCalendarLite } from './calendar/TasksCalendarLite'; // agenda calendar

import type { HubPayload } from '@api';
import { BarsCard } from '@ui/visuals/BarsCard'; // RN resolves .native/.web automatically
import { EntityRow } from '../../../ui/composites/list-rows';

const webPanY = Platform.OS === 'web' ? ({ touchAction: 'pan-y' } as any) : {};

type Tab = 'dashboard' | 'tasks' | 'contacts' | 'companies';

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

export function CRMTabs({
  hub,
  isLoading,
  isRefreshing,
  error,
  onRefresh,
  onAddTask,
  addingTask,
  onToggleTask,
  onDeleteTask,
  initialTab = 'dashboard',
}: Props) {
  const { t } = useTranslation();

  const [tab, setTab] = useState<Tab>(initialTab);
  const [editing, setEditing] = useState<HubPayload['tasks'][number] | null>(
    null,
  );

  const handleRefresh = useCallback(() => onRefresh(), [onRefresh]);

  // --- Mock data for the bar/line demo (visual polish first, wire real later)
  const barsMock = useMemo(
    () => [
      { label: 'Mon', value: 3 },
      { label: 'Tue', value: 6 },
      { label: 'Wed', value: 2 },
      { label: 'Thu', value: 5 },
      { label: 'Fri', value: 4 },
      { label: 'Sat', value: 1 },
      { label: 'Sun', value: 2 },
    ],
    [],
  );

  // --- Real counts for donut + calendar
  const totalTasks = hub.tasks.length;
  const doneTasks = hub.tasks.filter((t) => t.done).length;

  return (
    <>
      <ResponsiveTabsLayout
        tabs={[
          { key: 'dashboard', label: 'Dashboard' },
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
        {tab === 'dashboard' ? (
          <ScrollView
            className="flex-1 bg-surface dark:bg-surface-dark"
            contentContainerStyle={{
              padding: 16,
              paddingBottom: 28,
              gap: 16,
              ...webPanY,
            }}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {/* Optional: error banner */}
            {error ? (
              <Card inset className="mb-2">
                <Text className="text-red-600 font-bold">
                  {t('crm.loadError', { defaultValue: 'Failed to load data.' })}
                </Text>
              </Card>
            ) : null}

            {/* Row: Bar/Line */}
            <Card inset tone="flat" className="gap-4">
              <Text className="text-[15px] font-extrabold text-text dark:text-text-dark">
                Weekly Activity
              </Text>
              <BarsCard data={barsMock} />
            </Card>

            {/* Row: Donut */}
            <Card inset tone="flat" className="gap-4">
              <Text className="text-[15px] font-extrabold text-text dark:text-text-dark">
                Tasks completion
              </Text>
              {/* <DonutTasks  done={doneTasks} total={totalTasks} /> */}
            </Card>

            <TasksCalendarLite tasks={hub.tasks as any} />
          </ScrollView>
        ) : tab === 'tasks' ? (
          <ScrollView
            className="flex-1 bg-surface dark:bg-surface-dark"
            contentContainerStyle={{
              padding: 16,
              paddingBottom: 28,
              ...webPanY,
            }}
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
            {/* Tasks */}
            <Card
              tone="flat"
              bordered={false}
              inset={false}
              radius="top-none"
              className="overflow-hidden"
            >
              <AddTaskInline onAdd={onAddTask} isSaving={addingTask} />
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
                        onToggle={() => onToggleTask(task.id, !task.done)}
                        onDelete={() => onDeleteTask(task.id)}
                        onEdit={() => setEditing(task)}
                      />
                    </List.Item>
                  ))}
                </List>
              )}
            </Card>
          </ScrollView>
        ) : tab === 'contacts' ? (
          <ScrollView
            className="flex-1 bg-surface dark:bg-surface-dark"
            contentContainerStyle={{ padding: 16, paddingBottom: 28 }}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <Card tone="flat" inset={false} bodyClassName="gap-1.5">
              {isLoading ? (
                <ListSkeleton
                  rows={3}
                  rowHeight={60}
                  renderRow={() => <ContactItemSkeleton />}
                />
              ) : hub.contacts.length === 0 ? (
                <EmptyLine
                  text={t('crm.emptyContacts', {
                    defaultValue: 'No contacts.',
                  })}
                />
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
          </ScrollView>
        ) : (
          // companies
          <ScrollView
            className="flex-1 bg-surface dark:bg-surface-dark"
            contentContainerStyle={{ padding: 16, paddingBottom: 28 }}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <Card tone="flat" inset={false} bodyClassName="gap-1.5">
              {isLoading ? (
                <ListSkeleton
                  rows={3}
                  rowHeight={60}
                  renderRow={() => <CompanyItemSkeleton />}
                />
              ) : hub.companies.length === 0 ? (
                <EmptyLine
                  text={t('crm.emptyCompanies', {
                    defaultValue: 'No companies.',
                  })}
                />
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
          </ScrollView>
        )}
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
