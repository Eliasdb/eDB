// apps/mobile/src/app/(tabs)/profile/(features)/security.tsx
import { IntroCard } from '@features/profile/components/IntroCard';
import { SessionsCard } from '@features/profile/components/security/SessionsCard';
import { getMockSessions } from '@features/profile/config/security';
import { getSecuritySections } from '@features/profile/config/security-sections';
import { SettingsRow } from '@ui/composites/list-rows/settings-row/settings-row';
import { PageContainer, Screen, Section, TwoCol } from '@ui/layout';
import { useRouter } from 'expo-router';
import { useState } from 'react';

export default function SecurityScreen() {
  const router = useRouter();
  const [twoFA, setTwoFA] = useState(false);
  const [passkeys, setPasskeys] = useState(false);

  const sessions = getMockSessions();
  const sections = getSecuritySections({
    twoFA,
    setTwoFA,
    passkeys,
    setPasskeys,
    router,
  });

  return (
    <Screen
      center={false}
      padding={{ h: 16, top: 16, bottom: 24 }}
      safeBottom
      showsVerticalScrollIndicator={false}
    >
      <PageContainer maxWidth={1100} paddingH={16}>
        <IntroCard title="Keep your account safe">
          Manage sign-in options, enable two-factor authentication, and review
          your active sessions. Passkeys provide a faster, phishing-resistant
          login.
        </IntroCard>

        <TwoCol columns={2} gap={16} breakpoint={1024}>
          {sections.map((section) => (
            <Section key={section.key} title={section.title}>
              {section.rows.map((row, i) => (
                <SettingsRow key={`${section.key}-${i}`} {...row} />
              ))}
            </Section>
          ))}

          <Section title="Active sessions">
            <SessionsCard
              sessions={sessions}
              onSignOutOne={(id) => console.log('sign out', id)}
              onSignOutOthers={() => console.log('sign out others')}
            />
          </Section>
        </TwoCol>
      </PageContainer>
    </Screen>
  );
}
