import { IntroHeader } from '@ui/composites/intro-header/intro-header';
import RecordRow from '@ui/composites/record-row';
import StatsRowCard from '@ui/composites/stats-row-card';
import { Section } from '@ui/layout';
import { Badge, EmptyLine, List } from '@ui/primitives';
import { Text as RNText, View } from 'react-native';

import type { CompanyOverview } from '@data-access/crm/companies/types';
import {
  getTasksGlanceItems,
  mapTaskToView,
} from './company-tasks-collection.config';

export type TasksCollectionProps = {
  data?: CompanyOverview;
  loading?: boolean;
};

export function TasksCollection({ data, loading }: TasksCollectionProps) {
  const tasks: any[] = data?.tasks ?? [];

  // ✅ Render in server order.
  const rows = tasks.map(mapTaskToView);
  const glanceItems = getTasksGlanceItems(data);

  // Tiny footer (until backend exposes done/blocked counts)
  const { done, blocked } = tasks.reduce(
    (acc, t: any) => {
      const s = String(t?.status ?? t?.state ?? '').toLowerCase();
      if (
        t?.done === true ||
        s === 'done' ||
        s === 'completed' ||
        s === 'closed'
      )
        acc.done++;
      else if (s === 'blocked') acc.blocked++;
      return acc;
    },
    { done: 0, blocked: 0 },
  );

  return (
    <View>
      <IntroHeader text="Open work for this account." variant="secondary" />

      <Section title="At a glance" titleGap={14} flushTop>
        <StatsRowCard items={glanceItems} />
      </Section>

      <Section title="Tasks" titleGap={14}>
        {rows.length ? (
          <List>
            {rows.map((r, idx) => (
              <List.Item key={r.id || `task-${idx}`} first={idx === 0}>
                <RecordRow
                  title={r.title}
                  secondary={r.secondary}
                  right={<Badge label={r.status.label} tint={r.status.tint} />}
                />
              </List.Item>
            ))}
          </List>
        ) : (
          <EmptyLine text={loading ? 'Loading…' : 'No tasks yet'} />
        )}
      </Section>

      {done + blocked > 0 ? (
        <View style={{ paddingHorizontal: 18, marginTop: 10 }}>
          <RNText
            className="text-text-dim dark:text-text-dimDark"
            style={{ fontSize: 12 }}
          >
            {done} done • {blocked} blocked
          </RNText>
        </View>
      ) : null}
    </View>
  );
}
