// features/crm/components/companies/WorkCollection.tsx
import type { CompanyOverview } from '@data-access/crm/companies/types';
import { IntroHeader } from '@ui/composites/intro-header/intro-header';
import RecordRow from '@ui/composites/record-row';
import StatsRowCard from '@ui/composites/stats-row-card';
import { Section } from '@ui/layout';
import { EmptyLine, List } from '@ui/primitives';
import { Text as RNText } from 'react-native';
import {
  getContactsGlanceItems,
  mapContactToView,
} from './company-contacts-collection.config';

export type WorkCollectionProps = { data?: CompanyOverview; loading?: boolean };

export function WorkCollection({ data, loading }: WorkCollectionProps) {
  const rows = (data?.contacts ?? []).map(mapContactToView);
  const glanceItems = getContactsGlanceItems(data);

  return (
    <>
      <IntroHeader
        text="People connected to this account."
        variant="secondary"
      />

      <Section title="At a glance" titleGap={14} flushTop>
        <StatsRowCard items={glanceItems} />
      </Section>

      <Section title="Related contacts" titleGap={8}>
        {rows.length ? (
          <List>
            {rows.map((r, idx) => (
              <List.Item key={r.id ?? `contact-${idx}`} first={idx === 0}>
                <RecordRow
                  title={r.title}
                  secondary={r.secondary}
                  right={
                    r.rightText ? (
                      <RNText
                        className="text-text-dim dark:text-text-dimDark"
                        style={{ fontSize: 11 }}
                      >
                        • {r.rightText}
                      </RNText>
                    ) : null
                  }
                />
              </List.Item>
            ))}
          </List>
        ) : (
          <EmptyLine text={loading ? 'Loading…' : 'No contacts yet'} />
        )}
      </Section>
    </>
  );
}
