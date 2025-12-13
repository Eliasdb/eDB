import { Card, Screen } from '@edb/shared-ui-rn';
import { Text } from 'react-native';

export default function CRMDashboard() {
  return (
    <Screen padding={16} center={false}>
      {/* Optional: error banner */}

      {/* Bar/Line demo */}
      <Card inset tone="flat" className="gap-4">
        <Text className="text-[15px] font-extrabold text-text dark:text-text-dark">
          Weekly Activity
        </Text>
        {/* <BarsCard data={barsMock} /> */}
      </Card>

      {/* Donut placeholder */}
      {/* <Card inset tone="flat" className="gap-1">
        <Text className="text-[15px] font-extrabold text-text dark:text-text-dark">
          Tasks completion
        </Text>
        <Text className="text-[14px] text-text-dim dark:text-text-dimDark">
          {doneTasks}/{totalTasks} {t('crm.tasks', { defaultValue: 'tasks' })}{' '}
          {t('crm.done', { defaultValue: 'done' })}
        </Text>
      </Card> */}

      {/* Agenda calendar (handles empty array fine) */}
      {/* <TasksCalendarLite tasks={hub.tasks as any} /> */}
    </Screen>
  );
}
