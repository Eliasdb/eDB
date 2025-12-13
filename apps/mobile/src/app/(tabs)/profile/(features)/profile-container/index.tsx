import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';

import {
  PreferencesPanel,
  ProfileCard,
  SettingsPanel,
} from '@edb-clara/feature-profile';
import { PageContainer, Screen, TwoCol } from '@edb/shared-ui-rn';
import { useWindowDimensions, View } from 'react-native';

export default function ProfileScreen() {
  const router = useRouter();
  const { t } = useTranslation();

  const { width } = useWindowDimensions();
  const isDesktop = width >= 1024;

  return (
    <Screen
      center={isDesktop}
      padding={{ h: 4, top: 16, bottom: 24 }}
      safeBottom
      showsVerticalScrollIndicator={false}
    >
      <PageContainer maxWidth={1100} paddingH={16}>
        <TwoCol columns={2} widths={[0.32, 0.68]} gap={16} breakpoint={920}>
          {/* Left column */}
          <ProfileCard
            name={t('profile.name')}
            email={t('profile.email')}
            onChangePhoto={() =>
              router.push('/(tabs)/profile/(features)/personal-details')
            }
            onManageVoice={() => router.push('./voice-mode')}
          />

          {/* Right column (grouped) */}
          <View className="flex-1 min-w-0">
            <SettingsPanel
              title={t('profile.account')}
              items={[
                {
                  label: t('profile.personalDetails'),
                  icon: 'person-outline',
                  onPress: () =>
                    router.push('/(tabs)/profile/(features)/personal-details'),
                },
                {
                  label: t('profile.security'),
                  icon: 'shield-checkmark-outline',
                  onPress: () =>
                    router.push('/(tabs)/profile/(features)/security'),
                },
                {
                  label: t('profile.connectedApps'),
                  icon: 'link-outline',
                  onPress: () =>
                    router.push('/(tabs)/profile/(features)/integrations'),
                },
                {
                  label: 'Developer',
                  icon: 'code-slash-outline',
                  onPress: () => router.push('/storybook'),
                },
                {
                  label: 'Skeletons',
                  icon: 'code-slash-outline',
                  onPress: () => router.push('/(dev)/SkeletonPlayground'),
                },
              ]}
            />

            <PreferencesPanel
              title={t('profile.preferences')}
              notificationItemLabel={t('settings.notifications')}
              voiceItemLabel={t('settings.voiceMode')}
              onPressVoice={() => router.push('/profile/voice-mode')}
            />
          </View>
        </TwoCol>
      </PageContainer>
    </Screen>
  );
}
