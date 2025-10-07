import { useHub } from '@api';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { TasksCalendarLite } from '@features/crm/components';
import { Screen } from '@ui/layout';
import { Card } from '@ui/primitives';
import { Text } from 'react-native';

export default function CRMDashboard() {
  const { t } = useTranslation();
  const { data, error } = useHub();

  // ✅ safe fallback when data hasn’t arrived yet
  const hub = data ?? { tasks: [], contacts: [], companies: [] };

  const totalTasks = hub.tasks.length;
  const doneTasks = hub.tasks.filter((x) => x.done).length;

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

  return (
    <Screen padding={16} center={false}>
      {/* Optional: error banner */}
      {error ? (
        <Card inset className="mb-2">
          <Text className="text-red-600 font-bold">
            {t('crm.loadError', { defaultValue: 'Failed to load data.' })}
          </Text>
        </Card>
      ) : null}

      {/* Bar/Line demo */}
      <Card inset tone="flat" className="gap-4">
        <Text className="text-[15px] font-extrabold text-text dark:text-text-dark">
          Weekly Activity
        </Text>
        {/* <BarsCard data={barsMock} /> */}
      </Card>

      {/* Donut placeholder */}
      <Card inset tone="flat" className="gap-1">
        <Text className="text-[15px] font-extrabold text-text dark:text-text-dark">
          Tasks completion
        </Text>
        <Text className="text-[14px] text-text-dim dark:text-text-dimDark">
          {doneTasks}/{totalTasks} {t('crm.tasks', { defaultValue: 'tasks' })}{' '}
          {t('crm.done', { defaultValue: 'done' })}
        </Text>
      </Card>

      {/* Agenda calendar (handles empty array fine) */}
      <TasksCalendarLite tasks={hub.tasks as any} />
    </Screen>
  );
}
