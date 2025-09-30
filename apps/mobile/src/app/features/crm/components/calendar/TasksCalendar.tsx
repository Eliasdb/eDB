// apps/mobile/src/features/crm/components/TasksCalendar.tsx
import { useThemePreference } from '@ui/providers/themePreference';
import React, { useEffect, useMemo, useState } from 'react';
import { Platform, Text, View } from 'react-native';
import { Agenda } from 'react-native-calendars';

// Your domain type
type Task = {
  id: string;
  title: string;
  due: string; // "YYYY-MM-DD"
  done?: boolean;
};

type Props = {
  tasks: Task[];
  title?: string;
};

function toYMD(d: string | Date) {
  const dt = typeof d === 'string' ? new Date(d) : d;
  const y = dt.getFullYear();
  const m = `${dt.getMonth() + 1}`.padStart(2, '0');
  const day = `${dt.getDate()}`.padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function TasksCalendar({ tasks, title = 'Calendar' }: Props) {
  const { effective } = useThemePreference();
  const isDark = effective === 'dark';

  const C = {
    bg: isDark ? '#0d1116' : '#ffffff',
    card: isDark ? '#12161c' : '#f9fafb',
    text: isDark ? '#e6eaef' : '#111315',
    dim: isDark ? '#9aa3ad' : '#5f6368',
    border: isDark ? '#2a3139' : '#e6eaf0',
    dotDone: isDark ? '#7bd88a' : '#1e8e3e',
    dotTodo: isDark ? '#8ab4f8' : '#1a73e8',
    sel: isDark ? '#1c2a3a' : '#e6f0ff',
    today: isDark ? '#233043' : '#e8eef8',
    arrow: isDark ? '#cfe1ff' : '#1a73e8',
  };

  // Build a normalized schedule & marks from tasks (pure, no identity churn in render)
  const computed = useMemo(() => {
    const schedule: Record<string, any[]> = {};
    const marks: Record<
      string,
      { marked?: boolean; dots?: { key: string; color: string }[] }
    > = {};

    for (const t of tasks) {
      const day = toYMD(t.due);
      const entry = {
        name: t.title, // Agenda's expected base field
        height: 64, // Agenda uses this to lay out rows
        day,
        _task: t, // keep original data here
      };
      (schedule[day] ??= []).push(entry);

      const dot = { key: t.id, color: t.done ? C.dotDone : C.dotTodo };
      if (!marks[day]) marks[day] = { marked: true, dots: [dot] };
      else if (marks[day].dots && marks[day].dots!.length < 3)
        marks[day].dots!.push(dot);
    }

    // Ensure "today" exists so Agenda has an initial bucket
    const today = toYMD(new Date());
    schedule[today] ??= [];

    return { schedule, marks };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tasks, isDark]);

  // Stable items object that Agenda can diff without throwing
  const [items, setItems] = useState<Record<string, any[]>>(() => {
    const today = toYMD(new Date());
    return { [today]: [] };
  });

  const [markedDates, setMarkedDates] = useState<Record<string, any>>({});
  const [selected, setSelected] = useState<string>(toYMD(new Date()));

  // Apply computed schedule/marks in an effect (avoid re-creating objects during render)
  useEffect(() => {
    // clone to guarantee new reference, but keep a consistent shape (all arrays)
    const nextItems: Record<string, any[]> = {};
    for (const [k, v] of Object.entries(computed.schedule)) {
      nextItems[k] = Array.isArray(v) ? v.slice() : [];
    }
    // keep the current selected bucket available even if empty
    if (!nextItems[selected]) nextItems[selected] = [];
    setItems(nextItems);
    setMarkedDates(computed.marks);
  }, [computed, selected]);

  // Make sure selecting a day always creates an array so Agenda doesn't blow up
  const handleDayPress = (d: any) => {
    const ds = d?.dateString || toYMD(new Date(d?.timestamp ?? Date.now()));
    setSelected(ds);
    setItems((prev) => {
      if (prev[ds]) return prev;
      return { ...prev, [ds]: [] };
    });
  };

  const theme: Record<string, any> = {
    backgroundColor: C.bg,
    calendarBackground: C.bg,
    textSectionTitleColor: C.dim,
    monthTextColor: C.text,
    textMonthFontWeight: '800',
    textMonthFontSize: 16,
    dayTextColor: C.text,
    todayTextColor: C.text,
    todayBackgroundColor: C.today,
    selectedDayBackgroundColor: C.sel,
    selectedDayTextColor: C.text,
    textDisabledColor: isDark ? '#58606a' : '#c0c6cf',
    arrowColor: C.arrow,
    agendaDayTextColor: C.dim,
    agendaDayNumColor: C.text,
    agendaTodayColor: C.text,
    agendaKnobColor: isDark ? '#2f3741' : '#d9e1ea',
  };

  return (
    <View
      className="rounded-2xl border border-border dark:border-border-dark bg-surface dark:bg-surface-dark"
      style={{ overflow: 'hidden' }}
    >
      {/* Header */}
      <View style={{ paddingHorizontal: 16, paddingTop: 14, paddingBottom: 8 }}>
        <Text style={{ color: C.text, fontWeight: '800', fontSize: 16 }}>
          {title}
        </Text>
        <Text style={{ color: C.dim, fontSize: 12, marginTop: 2 }}>
          Tap a date to view tasks.
        </Text>
      </View>

      <Agenda
        items={items as any}
        markedDates={markedDates as any}
        markingType="multi-dot"
        selected={selected}
        onDayPress={handleDayPress}
        // Help the legacy ListView diff rows safely
        rowHasChanged={(r1: any, r2: any) =>
          r1?.name !== r2?.name || r1?._task?.done !== r2?._task?.done
        }
        // Optional bounds to reduce internal paging surprises
        pastScrollRange={12}
        futureScrollRange={12}
        // Renderers
        renderItem={(reservation: any /* AgendaEntry */) => {
          const t: Task | undefined = reservation?._task;
          return (
            <View
              style={{
                marginRight: 16,
                marginTop: 8,
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
                {t?.title ?? reservation?.name}
              </Text>
              <Text style={{ color: C.dim, fontSize: 12 }}>
                {t?.done ? 'Done' : 'Not done'}
              </Text>
            </View>
          );
        }}
        renderEmptyData={() => (
          <View style={{ padding: 16 }}>
            <Text style={{ color: C.dim, fontSize: 12 }}>
              No tasks this day.
            </Text>
          </View>
        )}
        theme={theme}
        showClosingKnob
        style={{ height: Platform.OS === 'web' ? 460 : undefined }}
      />
    </View>
  );
}
