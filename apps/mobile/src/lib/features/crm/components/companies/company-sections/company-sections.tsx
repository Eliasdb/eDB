import { Section } from '@ui/layout';
import { EmptyLine, List } from '@ui/primitives';
import { View } from 'react-native';

import {
  companySectionsConfig,
  type SectionKey,
} from '../../../config/companies.data';

import type { CompanyOverview } from '@api/core/types';

export function CompanySections({
  data,
  only,
}: {
  data?: CompanyOverview;
  /** Optional: restrict which sections to render */
  only?: readonly SectionKey[];
}) {
  // Normalize just the array bits we need
  const arrays: Record<SectionKey, any[]> = {
    contacts: data?.contacts ?? [],
    activities: data?.activities ?? [],
    tasks: data?.tasks ?? [],
  };

  const cfg = only
    ? companySectionsConfig.filter((c) => only.includes(c.key))
    : companySectionsConfig;

  return (
    <>
      {cfg.map((sec) => {
        const items = arrays[sec.key];
        return (
          <View key={sec.title} className="px-4">
            <Section title={sec.title} flushTop>
              {items.length ? (
                <List>
                  {items.map((item: any, idx: number) => (
                    <List.Item
                      key={item.id ?? `${sec.key}-${idx}`}
                      first={idx === 0}
                    >
                      {sec.render(item)}
                    </List.Item>
                  ))}
                </List>
              ) : (
                <EmptyLine text={sec.empty} />
              )}
            </Section>
          </View>
        );
      })}
    </>
  );
}

export default CompanySections;
