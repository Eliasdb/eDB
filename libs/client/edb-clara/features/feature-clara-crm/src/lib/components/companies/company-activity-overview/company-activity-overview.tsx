import type { Activity } from '@data-access/crm/activities';
import { ActivityTimeline, IntroHeader, ScreenToggle } from '@edb/shared-ui-rn';
import { useState } from 'react';
import { View } from 'react-native';
import ActivityCalendarPanel from '../ActivityCalendarPanel';

type ViewMode = 'list' | 'calendar';

export function CompanyActivityOverview({
  activities = [],
  loading,
}: {
  activities?: Activity[];
  loading?: boolean;
}) {
  const [mode, setMode] = useState<ViewMode>('list');

  const headerActions = (
    <ScreenToggle<ViewMode>
      value={mode}
      onChange={setMode}
      size="sm"
      gap={6}
      options={[
        { value: 'list', icon: 'reorder-two-outline', ariaLabel: 'List view' },
        {
          value: 'calendar',
          icon: 'calendar-outline',
          ariaLabel: 'Calendar view',
        },
      ]}
    />
  );

  return (
    <View>
      <IntroHeader
        text="Emails, meetings, calls & notes by day."
        right={headerActions}
        variant="secondary"
      />
      {mode === 'list' ? (
        <ActivityTimeline
          title="Timeline"
          activities={activities}
          loading={loading}
        />
      ) : (
        <ActivityCalendarPanel activities={activities} loading={loading} />
      )}
    </View>
  );
}
