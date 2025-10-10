// libs/ui/composites/activity/company-activity-overview.tsx
import * as React from 'react';
import { useColorScheme, View } from 'react-native';
import { Calendar } from 'react-native-calendars';

import type { Activity } from '@api/core/types';
import {
  ActivityEventRow,
  ActivityTimeline,
  IntroHeader,
} from '@ui/composites';
import { Section } from '@ui/layout'; // ← use the shared Section
import { ScreenToggle } from '@ui/navigation';
import { EmptyLine, List } from '@ui/primitives';

/* ----------------------------- helpers & types ---------------------------- */

type CalendarDay = {
  dateString: string;
  day: number;
  month: number;
  year: number;
  timestamp?: number;
};

type ViewMode = 'list' | 'calendar';

const typeColor: Record<Activity['type'], string> = {
  meeting: '#EAB308',
  call: '#10B981',
  note: '#8B5CF6',
  email: '#60A5FA',
  status: '#F59E0B',
  system: '#94A3B8',
};

const withAlpha = (hex: string, a: number) => {
  const r = parseInt(hex.slice(1, 3), 16),
    g = parseInt(hex.slice(3, 5), 16),
    b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${a})`;
};

const yyyyMMdd = (iso: string) => new Date(iso).toISOString().slice(0, 10);

function groupBy<T, K extends string | number>(rows: T[], key: (t: T) => K) {
  return rows.reduce(
    (acc, item) => {
      const k = key(item);
      (acc[k] ??= []).push(item);
      return acc;
    },
    {} as Record<K, T[]>,
  );
}

/* -------------------------------- component ------------------------------- */

export type CompanyActivityOverviewProps = {
  activities?: Activity[];
  loading?: boolean;
};

export function CompanyActivityOverview({
  activities = [],
  loading,
}: CompanyActivityOverviewProps) {
  const [mode, setMode] = React.useState<ViewMode>('list');

  const datesGrouped = React.useMemo(
    () => groupBy(activities, (a) => yyyyMMdd(a.at)),
    [activities],
  );
  const firstDate = React.useMemo(
    () => Object.keys(datesGrouped).sort()[0],
    [datesGrouped],
  );
  const [selected, setSelected] = React.useState<string | undefined>(firstDate);

  const marked = React.useMemo(() => {
    const out: Record<
      string,
      {
        dots?: { key: string; color: string }[];
        selected?: boolean;
        selectedColor?: string;
      }
    > = {};
    for (const [date, rows] of Object.entries(datesGrouped)) {
      const kinds = Array.from(new Set(rows.map((r) => r.type)));
      out[date] = {
        dots: kinds.map((k) => ({
          key: k,
          color: typeColor[k as Activity['type']],
        })),
      };
    }
    if (selected) {
      out[selected] = {
        ...(out[selected] ?? {}),
        selected: true,
        selectedColor: withAlpha('#6C63FF', 0.22),
      };
    }
    return out;
  }, [datesGrouped, selected]);

  const selectedRows = React.useMemo(
    () => (selected ? (datesGrouped[selected] ?? []) : []),
    [datesGrouped, selected],
  );

  const isDark = useColorScheme() === 'dark';
  const neutral = isDark ? '#9AA3B2' : '#6B7280';
  // const segmentedBorder = isDark ? '#2A2F3A' : '#E5E7EB'; // same as Segmented primary
  const segmentedBorder = isDark
    ? 'rgba(255,255,255,0.06)'
    : 'rgba(0,0,0,0.06)';

  const CONTENT_TOP_SPACING = 24; // distance from header to content

  // build optional header actions (slot)
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
      {/* Intro + toggle row */}
      <IntroHeader
        text="Emails, meetings, calls & notes by day."
        right={headerActions}
        variant="secondary"
      />

      {/* consistent spacing under header for both modes */}
      <View style={{ height: CONTENT_TOP_SPACING }} />

      {mode === 'list' ? (
        // Timeline list view
        <ActivityTimeline
          title="Timeline"
          activities={activities}
          loading={loading}
        />
      ) : (
        <>
          {/* Calendar section */}
          <Section title="Calendar" flushTop titleGap={20}>
            <View className="p-0 overflow-hidden">
              <Calendar
                markingType="multi-dot"
                markedDates={marked as any}
                onDayPress={(d: CalendarDay) => setSelected(d.dateString)}
                theme={{
                  calendarBackground: 'transparent',
                  textSectionTitleColor: neutral,
                  monthTextColor: isDark ? '#E5E7EB' : '#111827',
                  dayTextColor: isDark ? '#E5E7EB' : '#111827',
                  todayTextColor: '#6C63FF',
                  arrowColor: '#6C63FF',
                  textDayFontSize: 11,
                  textDayHeaderFontSize: 10,
                  textMonthFontSize: 15,
                }}
                style={{ paddingVertical: 2 }}
              />
            </View>
          </Section>
          {/* Events section */}
          <Section title={selected ? `Events • ${selected}` : 'Events'}>
            {selectedRows.length === 0 ? (
              <EmptyLine text="Pick a day to see its events" />
            ) : (
              <List>
                {selectedRows
                  .slice()
                  .sort((a, b) => (a.at < b.at ? 1 : -1))
                  .map((a, idx) => (
                    <List.Item key={a.id} first={idx === 0}>
                      <ActivityEventRow
                        summary={a.summary}
                        type={a.type}
                        at={a.at}
                        tint={typeColor[a.type]}
                      />
                    </List.Item>
                  ))}
              </List>
            )}
          </Section>
        </>
      )}
    </View>
  );
}
