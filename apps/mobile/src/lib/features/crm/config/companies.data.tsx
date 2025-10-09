// libs/ui/composites/company/company-sections.config.ts
import { TwoLineRow } from '@ui/composites';
import React from 'react';

export type SectionKey = 'contacts' | 'activities' | 'tasks';

export type SectionConfig = {
  title: string;
  key: SectionKey;
  empty: string;
  render: (item: any) => React.ReactNode;
};

export const companySectionsConfig = [
  {
    title: 'Contacts',
    key: 'contacts',
    empty: 'No contacts yet',
    render: (c: {
      id: string;
      name: string;
      title?: string;
      email?: string;
    }) => (
      <TwoLineRow
        icon="person-outline"
        primary={c.name}
        secondary={c.title ?? c.email ?? '—'}
      />
    ),
  },
  {
    title: 'Timeline',
    key: 'activities',
    empty: 'No activity yet',
    render: (a: { id: string; summary: string; type: string; at: string }) => (
      <TwoLineRow
        icon="chatbubble-ellipses-outline"
        primary={a.summary}
        secondary={`${a.type} • ${a.at}`}
      />
    ),
  },
  {
    title: 'Tasks',
    key: 'tasks',
    empty: 'No tasks yet',
    render: (t: {
      id: string;
      title: string;
      done?: boolean;
      due?: string;
    }) => (
      <TwoLineRow
        icon={t.done ? 'checkmark-circle-outline' : 'ellipse-outline'}
        primary={t.title}
        secondary={t.due ?? 'No due date'}
      />
    ),
  },
] as const satisfies readonly SectionConfig[];
