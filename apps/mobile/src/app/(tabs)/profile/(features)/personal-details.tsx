// apps/mobile/src/app/(tabs)/profile/(features)/personal-details.tsx
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import { PageContainer, Screen, TwoCol } from '@ui/layout';
import { Card } from '@ui/primitives';

import {
  ProfileFieldRenderer,
  ProfileSummaryCard,
} from '@features/profile/components';

import { usePersonalDetailsForm } from '@features/profile/hooks/usePersonalDetailsForm';
import ResponsiveSaveBar from './res';

export default function PersonalDetailsScreen() {
  const router = useRouter();
  const { t } = useTranslation();

  const { state, cards, dirty } = usePersonalDetailsForm(t);

  return (
    <>
      <Screen center={false} padding={{ h: 0, top: 16, bottom: 24 }} safeBottom>
        <PageContainer>
          {/* Summary up top */}
          <ProfileSummaryCard
            firstName={state.firstName}
            lastName={state.lastName}
            role={state.role}
            company={state.company}
          />

          {/* One loop for all editable cards */}
          <TwoCol columns={2} gap={16} breakpoint={1024}>
            {cards.map((c) => (
              <Card
                key={c.key}
                title={c.title}
                bordered={c.bordered}
                className={c.className}
                noHeaderXPadding
              >
                <View className="pb-4">
                  {c.fields.map((f) => (
                    <ProfileFieldRenderer key={f.key} field={f} />
                  ))}
                </View>
              </Card>
            ))}
          </TwoCol>
        </PageContainer>
        <View className="h-16" />
      </Screen>

      <ResponsiveSaveBar
        dirty={dirty}
        onSave={() => router.back()}
        label={t('personal.saveChanges')}
        unsavedText={t('personal.unsaved', 'You have unsaved changes')}
        upToDateText="Up to date"
        pad={12}
        safeBottom={false}
        variant="floating" // 👈 shows the pill on ALL platforms
        maxWidth={1100} // keep aligned with PageContainer
      />
    </>
  );
}
