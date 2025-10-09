// libs/ui/composites/company/company-sections.tsx
import type { CompanyOverview } from '@api/core/types'; // adjust path as needed
import { EmptyLine, List } from '@ui/primitives';
import React from 'react';
import { View } from 'react-native';
import { Section } from '../../../../ui/layout';
import { companySectionsConfig, type SectionKey } from './CompanySections';

export function CompanySections({ data }: { data?: CompanyOverview }) {
  // Normalize just the array bits we need
  const arrays: Record<SectionKey, any[]> = {
    contacts: data?.contacts ?? [],
    activities: data?.activities ?? [],
    tasks: data?.tasks ?? [],
  };

  return (
    <>
      {companySectionsConfig.map((sec) => {
        const items = arrays[sec.key];
        return (
          <View key={sec.title} className="px-4">
            <Section title={sec.title}>
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
