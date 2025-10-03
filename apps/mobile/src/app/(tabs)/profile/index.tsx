import { ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';

import {
  PreferencesPanel,
  ProfileCard,
  SettingsPanel,
} from '@features/profile';

import { PageContainer, TwoCol } from '@ui/layout';

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { t } = useTranslation();

  return (
    <View className="flex-1 bg-surface dark:bg-surface-dark">
      <ScrollView
        contentContainerStyle={{
          paddingTop: 16,
          paddingBottom: 24 + insets.bottom,
        }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <PageContainer maxWidth={1100} paddingH={16}>
          {/* Layout */}
          <TwoCol gap={16} breakpoint={920} leftWidth={0.32} rightWidth={0.68}>
            <ProfileCard
              name={t('profile.name')}
              email={t('profile.email')}
              onChangePhoto={() => {}}
              onManageVoice={() => router.push('/profile/voice-mode')}
            />
            <View style={{ flex: 1, minWidth: 0 }}>
              <SettingsPanel
                title={t('profile.account')}
                items={[
                  {
                    label: t('profile.personalDetails'),
                    icon: 'person-outline',
                    onPress: () => router.push('/profile/personal-details'),
                  },
                  {
                    label: t('profile.security'),
                    icon: 'shield-checkmark-outline',
                    onPress: () => router.push('/profile/security'),
                  },
                  {
                    label: t('profile.connectedApps'),
                    icon: 'link-outline',
                    onPress: () => router.push('/profile/integrations'),
                  },
                  {
                    label: 'Developer',
                    icon: 'code-slash-outline',
                    onPress: () => router.push('/storybook'),
                  },
                ]}
              ></SettingsPanel>

              <PreferencesPanel
                title={t('profile.preferences')}
                notificationItemLabel={t('settings.notifications')}
                voiceItemLabel={t('settings.voiceMode')}
                onPressVoice={() => router.push('/profile/voice-mode')}
              />
            </View>
          </TwoCol>
        </PageContainer>
      </ScrollView>
    </View>
  );
}
