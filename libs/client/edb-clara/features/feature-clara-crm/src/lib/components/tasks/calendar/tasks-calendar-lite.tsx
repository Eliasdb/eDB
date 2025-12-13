import { useThemePreference } from '@edb/shared-ui-rn';
import { useMemo, useState } from 'react';

import { Platform, Text, View } from 'react-native';
import { Calendar } from 'react-native-calendars';

type Task = {
  id: string;
  title: string;
  due: string; // YYYY-MM-DD
  done?: boolean;
};

type Props = {
  tasks: Task[];
  title?: string;
  /** Hide the internal header if the parent already shows a section title */
  showHeader?: boolean;
};

type MarkedDate = {
  marked?: boolean;
  dotColor?: string;
  customStyles?: { container?: object; text?: object };
  selected?: boolean;
  selectedColor?: string;
  selectedTextColor?: string;
};
type MarkedDateMap = Record<string, MarkedDate>;

// Replace your helper with this
function toYMD(input?: string | Date | null) {
  // fallback to today if input is missing/invalid
  const fallback = new Date();

  let dt: Date;
  if (input instanceof Date) {
    dt = input;
  } else if (typeof input === 'string') {
    // Handle "YYYY-MM-DD" safely (avoid platform parsing quirks)
    const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(input.trim());
    if (m) {
      dt = new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
    } else {
      const parsed = new Date(input);
      dt = Number.isNaN(parsed.getTime()) ? fallback : parsed;
    }
  } else {
    dt = fallback;
  }

  const y = dt.getFullYear();
  const m = String(dt.getMonth() + 1).padStart(2, '0');
  const d = String(dt.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function TasksCalendarLite({
  tasks,
  title = 'Calendar',
  showHeader = true,
}: Props) {
  const { effective } = useThemePreference();
  const isDark = effective === 'dark';

  // palette derived from theme
  const C = {
    bg: isDark ? '#0d1116' : '#ffffff',
    card: isDark ? '#12161c' : '#f9fafb',
    text: isDark ? '#e6eaef' : '#111315',
    dim: isDark ? '#9aa3ad' : '#5f6368',
    border: isDark ? '#2a3139' : '#e6eaf0',
    dotDone: isDark ? '#7bd88a' : '#1e8e3e',
    dotTodo: isDark ? '#8ab4f8' : '#1a73e8',
    selBg: isDark ? '#1c2a3a' : '#e6f0ff',
    todayBg: isDark ? '#233043' : '#e8eef8',
    arrow: isDark ? '#cfe1ff' : '#1a73e8',
  };

  // date -> tasks
  const byDate = useMemo(() => {
    const map: Record<string, Task[]> = {};
    for (const t of tasks) {
      const d = toYMD(t.due);
      (map[d] ??= []).push(t);
    }
    return map;
  }, [tasks]);

  // dots (recompute when theme flips so colors update immediately)
  const markedDates = useMemo<MarkedDateMap>(() => {
    const marks: MarkedDateMap = {};
    for (const [day, list] of Object.entries(byDate)) {
      const anyDone = list.some((t) => t.done);
      marks[day] = {
        marked: true,
        dotColor: anyDone ? C.dotDone : C.dotTodo,
      };
    }
    return marks;
  }, [byDate, C.dotDone, C.dotTodo]); // theme colors already derived

  const today = toYMD(new Date());
  const [selected, setSelected] = useState<string>(today);

  // selection & today styling
  const calendarMarks = useMemo<MarkedDateMap>(() => {
    return {
      ...markedDates,
      [selected]: {
        ...(markedDates[selected] || {}),
        selected: true,
        selectedColor: C.selBg,
        selectedTextColor: C.text,
      },
      // hint today with a subtle bg if it's not selected
      ...(selected !== today
        ? {
            [today]: {
              ...(markedDates[today] || {}),
              customStyles: {
                container: { backgroundColor: C.todayBg, borderRadius: 8 },
                text: { color: C.text },
              },
            },
          }
        : null),
    };
  }, [markedDates, selected, today, C.selBg, C.text, C.todayBg]);

  const theme: MarkedDate = {
    backgroundColor: C.bg,
    calendarBackground: C.bg,
    textSectionTitleColor: C.dim,
    selectedDayBackgroundColor: C.selBg,
    selectedDayTextColor: C.text,
    todayTextColor: C.text,
    dayTextColor: C.text,
    textDisabledColor: isDark ? '#58606a' : '#c0c6cf',
    dotColor: C.dotTodo,
    selectedDotColor: C.text,
    monthTextColor: C.text,
    textMonthFontWeight: '800',
    textMonthFontSize: 16,
    arrowColor: C.arrow,
  };

  const dayTasks = byDate[selected] ?? [];

  return (
    <View
      className="rounded-2xl border border-border dark:border-border-dark bg-surface dark:bg-surface-dark"
      style={{ overflow: 'hidden' }}
    >
      {showHeader && (
        <View
          style={{ paddingHorizontal: 16, paddingTop: 14, paddingBottom: 8 }}
        >
          <Text style={{ color: C.text, fontWeight: '800', fontSize: 16 }}>
            {title}
          </Text>
          <Text style={{ color: C.dim, fontSize: 12, marginTop: 2 }}>
            Tap a date to view tasks.
          </Text>
        </View>
      )}

      <Calendar
        key={`cal-${effective}`} // <- force remount on theme change
        markedDates={calendarMarks}
        markingType="dot"
        onDayPress={(d: { dateString?: string }) =>
          setSelected(d.dateString ?? selected)
        }
        theme={theme}
        style={{
          borderTopWidth: showHeader ? 1 : 0,
          borderBottomWidth: 1,
          borderColor: C.border,
        }}
        {...(Platform.OS === 'web' ? { enableSwipeMonths: true } : null)}
      />

      <View style={{ padding: 12, gap: 8 }}>
        {dayTasks.length === 0 ? (
          <View style={{ padding: 12 }}>
            <Text style={{ color: C.dim, fontSize: 12 }}>
              No tasks this day.
            </Text>
          </View>
        ) : (
          dayTasks.map((t) => (
            <View
              key={t.id}
              style={{
                padding: 12,
                backgroundColor: C.card,
                borderRadius: 12,
                borderWidth: 1,
                borderColor: C.border,
              }}
            >
              <Text
                style={{
                  color: C.text,
                  fontWeight: '700',
                  fontSize: 14,
                  marginBottom: 4,
                }}
                numberOfLines={2}
              >
                {t.title}
              </Text>
              <Text style={{ color: C.dim, fontSize: 12 }}>
                {t.done ? 'Done' : 'Not done'} · {t.due}
              </Text>
            </View>
          ))
        )}
      </View>
    </View>
  );
}
