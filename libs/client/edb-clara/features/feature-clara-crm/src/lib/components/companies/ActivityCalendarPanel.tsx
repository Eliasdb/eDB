import type { Activity } from '@edb-clara/client-crm';
import {
  ActivityEventRow,
  EmptyLine,
  List,
  Section,
  TwoCol,
} from '@edb/shared-ui-rn';
import { useMemo, useState } from 'react';
import { useColorScheme, View } from 'react-native';
import { Calendar } from 'react-native-calendars';
import type { MarkedDates } from 'react-native-calendars/src/types';

type CalendarDay = {
  dateString: string;
  day: number;
  month: number;
  year: number;
  timestamp?: number;
};

const TYPE_COLOR: Record<Activity['type'], string> = {
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

/** tolerant YYYY-MM-DD from ISO / PG-ish strings */
const toYMD = (iso?: string | null): string | null => {
  if (!iso) return null;
  if (/^\d{4}-\d{2}-\d{2}$/.test(iso)) return iso;
  let s = iso.replace(' ', 'T');
  if (/[+-]\d{2}$/.test(s)) s += ':00';
  if (!/[zZ]|[+-]\d{2}:\d{2}$/.test(s)) s += 'Z';
  const d = new Date(s);
  return Number.isNaN(d.getTime()) ? null : d.toISOString().slice(0, 10);
};

export default function ActivityCalendarPanel({
  activities = [],
  loading,
}: {
  activities?: Activity[];
  loading?: boolean;
}) {
  // group activities by date
  const byDate = useMemo(() => {
    const out: Record<string, Activity[]> = {};
    for (const a of activities) {
      const d = toYMD(a.at);
      if (!d) continue;
      (out[d] ??= []).push(a);
    }
    // time-desc within each day
    for (const k of Object.keys(out))
      out[k].sort((a, b) => (a.at < b.at ? 1 : -1));
    return out;
  }, [activities]);

  const dates = useMemo(() => Object.keys(byDate).sort(), [byDate]);
  const [selected, setSelected] = useState<string | undefined>(dates[0]);
  const rows = selected ? (byDate[selected] ?? []) : [];

  // calendar dots + selection
  const marked = useMemo(() => {
    type DotMarking = {
      dots?: { key: string; color: string }[];
      selected?: boolean;
      selectedColor?: string;
    };
    const m: Record<string, DotMarking> = {};
    for (const d of dates) {
      const kinds = new Set((byDate[d] ?? []).map((a) => a.type));
      m[d] = {
        dots: [...kinds].map((k) => ({ key: k, color: TYPE_COLOR[k] })),
      };
    }
    if (selected)
      m[selected] = {
        ...(m[selected] ?? {}),
        selected: true,
        selectedColor: withAlpha('#6C63FF', 0.22),
      };
    return m;
  }, [dates, byDate, selected]);

  const isDark = useColorScheme() === 'dark';
  const neutral = isDark ? '#9AA3B2' : '#6B7280';

  return (
    <TwoCol
      columns={2}
      gap={16}
      stackGap={16}
      breakpoint={1024}
      widths={[0.44, 0.56]}
    >
      {/* Calendar */}
      <Section title="Calendar" flushTop titleGap={20}>
        <View className="p-0 overflow-hidden">
          <Calendar
            markingType="multi-dot"
            markedDates={marked as MarkedDates}
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

      {/* Events */}
      <Section title={selected ? `Events • ${selected}` : 'Events'}>
        {loading ? (
          <EmptyLine text="Loading…" />
        ) : rows.length === 0 ? (
          <EmptyLine text="Pick a day to see its events" />
        ) : (
          <List>
            {rows.map((a, idx) => (
              <List.Item key={a.id ?? `${a.at}-${idx}`} first={idx === 0}>
                <ActivityEventRow
                  summary={a.summary}
                  type={a.type}
                  at={a.at}
                  tint={TYPE_COLOR[a.type]}
                />
              </List.Item>
            ))}
          </List>
        )}
      </Section>
    </TwoCol>
  );
}
