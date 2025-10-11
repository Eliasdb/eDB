import { IntroHeader } from '@ui/composites/intro-header/intro-header';
import { Card, EmptyLine, List } from '@ui/primitives';
import * as React from 'react';
import { Text, View } from 'react-native';

import type { CompanyOverview } from '@api/core/types';

/* ----------------------------- helpers ----------------------------- */

function relTime(iso?: string) {
  if (!iso) return undefined;
  const t = new Date(iso).getTime();
  if (Number.isNaN(t)) return undefined;
  const diff = t - Date.now(); // future -> positive (time until due)
  const abs = Math.abs(diff);

  const min = 60_000,
    hr = 60 * min,
    day = 24 * hr,
    wk = 7 * day;
  const fmt = (n: number, u: string) => `${n}${u}`;

  const label =
    abs < hr
      ? fmt(Math.max(1, Math.round(abs / min)), 'm')
      : abs < day
        ? fmt(Math.round(abs / hr), 'h')
        : abs < wk
          ? fmt(Math.round(abs / day), 'd')
          : fmt(Math.round(abs / wk), 'w');

  return diff < 0 ? `${label} overdue` : `in ${label}`;
}

function countByStatus(tasks: any[]) {
  const norm = (s?: string) => String(s ?? '').toLowerCase();
  let open = 0,
    done = 0,
    blocked = 0;
  for (const t of tasks) {
    const s = norm(t?.status ?? t?.state);
    if (s === 'done' || s === 'completed' || s === 'closed') done++;
    else if (s === 'blocked') blocked++;
    else open++;
  }
  return { open, done, blocked };
}

function statusPill(status?: string) {
  const s = String(status ?? '').toLowerCase();
  let c = '#6B7280',
    bg = 'rgba(107,114,128,0.12)',
    label = status ?? 'Open';
  if (s === 'done' || s === 'completed' || s === 'closed') {
    c = '#16a34a';
    bg = 'rgba(22,163,74,0.12)';
    label = 'Done';
  } else if (s === 'blocked') {
    c = '#ef4444';
    bg = 'rgba(239,68,68,0.12)';
    label = 'Blocked';
  } else if (s === 'in progress') {
    c = '#6366F1';
    bg = 'rgba(99,102,241,0.12)';
    label = 'In progress';
  }
  return { c, bg, label };
}

/* ----------------------------- panels ----------------------------- */

function Glance({
  total,
  open,
  nextDue,
}: {
  total: number;
  open: number;
  nextDue?: string;
}) {
  return (
    <View style={{ paddingHorizontal: 16, marginTop: 12 }}>
      <Card inset={false} bodyClassName="p-0 overflow-hidden">
        <View
          style={{
            flexDirection: 'row',
            paddingVertical: 10,
            paddingHorizontal: 12,
          }}
        >
          <View style={{ flex: 1 }}>
            <Text
              className="text-text-dim dark:text-text-dimDark"
              style={{ fontSize: 12, marginBottom: 2 }}
            >
              Open
            </Text>
            <Text
              className="text-text dark:text-text-dark"
              style={{ fontSize: 16, fontWeight: '700' }}
            >
              {open}
            </Text>
          </View>
          <View
            style={{ width: 1, backgroundColor: 'rgba(148,163,184,0.28)' }}
          />
          <View style={{ flex: 1, paddingLeft: 12 }}>
            <Text
              className="text-text-dim dark:text-text-dimDark"
              style={{ fontSize: 12, marginBottom: 2 }}
            >
              Total
            </Text>
            <Text
              className="text-text dark:text-text-dark"
              style={{ fontSize: 16, fontWeight: '700' }}
            >
              {total}
            </Text>
          </View>
          <View
            style={{ width: 1, backgroundColor: 'rgba(148,163,184,0.28)' }}
          />
          <View style={{ flex: 1, paddingLeft: 12 }}>
            <Text
              className="text-text-dim dark:text-text-dimDark"
              style={{ fontSize: 12, marginBottom: 2 }}
            >
              Next due
            </Text>
            <Text
              className="text-text dark:text-text-dark"
              style={{ fontSize: 16, fontWeight: '700' }}
            >
              {nextDue ? relTime(nextDue) : '—'}
            </Text>
          </View>
        </View>
      </Card>
    </View>
  );
}

function Panel({
  title,
  count,
  children,
}: {
  title: string;
  count?: number;
  children: React.ReactNode;
}) {
  return (
    <View style={{ paddingHorizontal: 16, marginTop: 16 }}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'baseline',
          justifyContent: 'space-between',
          marginBottom: 8,
          paddingHorizontal: 2,
        }}
      >
        <Text
          className="text-text-dim dark:text-text-dimDark"
          style={{ fontSize: 12, letterSpacing: 0.6 }}
        >
          {title.toUpperCase()}
        </Text>
        {typeof count === 'number' ? (
          <Text
            className="text-text-dim dark:text-text-dimDark"
            style={{ fontSize: 12 }}
          >
            {count}
          </Text>
        ) : null}
      </View>

      <Card inset={false} bodyClassName="p-0 overflow-hidden">
        {children}
      </Card>
    </View>
  );
}

/* ----------------------------- main view ----------------------------- */

export type TasksCollectionProps = {
  data?: CompanyOverview;
  loading?: boolean;
};

export default function TasksCollection({
  data,
  loading,
}: TasksCollectionProps) {
  const tasks: any[] = data?.tasks ?? [];

  // Sort soonest due first, fall back to updatedAt desc
  const sorted = tasks.slice().sort((a, b) => {
    const ad = new Date(a?.dueAt ?? a?.dueDate ?? 0).getTime();
    const bd = new Date(b?.dueAt ?? b?.dueDate ?? 0).getTime();
    if (!Number.isNaN(ad) && !Number.isNaN(bd) && ad !== bd) return ad - bd;
    const au = new Date(a?.updatedAt ?? 0).getTime();
    const bu = new Date(b?.updatedAt ?? 0).getTime();
    return (Number.isNaN(bu) ? 0 : bu) - (Number.isNaN(au) ? 0 : au);
  });

  const nextDue =
    sorted.find((t) => t?.dueAt || t?.dueDate)?.dueAt ??
    sorted.find((t) => t?.dueDate)?.dueDate;
  const { open, done, blocked } = countByStatus(tasks);

  return (
    <View>
      <IntroHeader text="Open work for this account." variant="secondary" />

      <Glance total={tasks.length} open={open} nextDue={nextDue} />

      <Panel title="Tasks" count={tasks.length}>
        {tasks.length ? (
          <List>
            {sorted.map((t: any, idx: number) => {
              const title = t?.title ?? t?.name ?? 'Untitled task';
              const assignee =
                t?.assignee?.name ??
                t?.assigneeName ??
                t?.owner?.name ??
                t?.ownerName ??
                undefined;
              const due = t?.dueAt ?? t?.dueDate;
              const pri = (t?.priority ?? '').toString();
              const s = statusPill(t?.status ?? t?.state);

              const secondaryBits = [
                assignee ? `@${assignee}` : null,
                due ? relTime(due) : null,
                pri ? String(pri) : null,
              ].filter(Boolean);
              const secondary = secondaryBits.join(' • ');

              return (
                <List.Item key={t?.id ?? `task-${idx}`} first={idx === 0}>
                  <View style={{ paddingVertical: 12, paddingHorizontal: 14 }}>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'flex-start',
                        justifyContent: 'space-between',
                        gap: 12,
                      }}
                    >
                      <View style={{ flex: 1 }}>
                        <Text
                          className="text-text dark:text-text-dark"
                          style={{ fontSize: 15, fontWeight: '700' }}
                        >
                          {title}
                        </Text>
                        {secondary ? (
                          <Text
                            className="text-text-dim dark:text-text-dimDark"
                            style={{ fontSize: 12, marginTop: 4 }}
                          >
                            {secondary}
                          </Text>
                        ) : null}
                      </View>

                      {/* status pill */}
                      <View
                        style={{
                          paddingHorizontal: 8,
                          paddingVertical: 4,
                          borderRadius: 999,
                          backgroundColor: s.bg,
                          borderWidth: 1,
                          borderColor: s.c
                            .replace('1)', '0.28)')
                            .replace('rgb', 'rgba'), // safe-ish, works with hex too via below
                        }}
                      >
                        <Text
                          style={{
                            fontSize: 11,
                            fontWeight: '800',
                            color: s.c,
                          }}
                        >
                          {s.label}
                        </Text>
                      </View>
                    </View>
                  </View>
                </List.Item>
              );
            })}
          </List>
        ) : (
          <EmptyLine text={loading ? 'Loading…' : 'No tasks yet'} />
        )}
      </Panel>

      {/* Optional: show a tiny “Done” count so it’s not lost */}
      {done + blocked > 0 ? (
        <View style={{ paddingHorizontal: 18, marginTop: 10 }}>
          <Text
            className="text-text-dim dark:text-text-dimDark"
            style={{ fontSize: 12 }}
          >
            {done} done • {blocked} blocked
          </Text>
        </View>
      ) : null}
    </View>
  );
}
