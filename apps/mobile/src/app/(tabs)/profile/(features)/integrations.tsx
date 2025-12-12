import { useMemo, useState } from 'react';

import { IntroCard } from '@edb-clara/feature-profile';
import {
  PageContainer,
  Screen,
  Section,
  SettingsRow,
  TwoCol,
} from '@edb/shared-ui-rn';

import {
  getIntegrationSections,
  type IntegrationSection,
} from '@edb-clara/feature-profile';

export default function IntegrationsScreen() {
  const sections = useMemo<IntegrationSection[]>(
    () => getIntegrationSections(),
    [],
  );
  const [toggles, setToggles] = useState<Record<string, boolean>>({});
  const setToggle = (key: string, v: boolean) =>
    setToggles((p) => ({ ...p, [key]: v }));

  return (
    <Screen
      center={false}
      padding={{ h: 4, top: 16, bottom: 24 }}
      safeBottom
      showsVerticalScrollIndicator={false}
    >
      <PageContainer maxWidth={1100} paddingH={16}>
        <IntroCard title="Connect your tools">
          Toggle integrations to let Clara read and sync data with your CRM and
          support platforms. This is a preview; toggles don’t perform real
          connections yet.
        </IntroCard>

        <TwoCol columns={2} gap={16} breakpoint={1024}>
          {sections.map((s) => (
            <Section key={s.key} title={s.title}>
              {s.items.map((it) => (
                <SettingsRow
                  key={it.key}
                  kind="toggle"
                  label={it.label}
                  icon={it.icon}
                  value={!!toggles[it.key]}
                  onValueChange={(v) => setToggle(it.key, v)}
                  border
                  borderPosition="bottom"
                />
              ))}
            </Section>
          ))}
        </TwoCol>
      </PageContainer>
    </Screen>
  );
}
