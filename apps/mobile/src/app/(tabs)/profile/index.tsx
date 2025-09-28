// apps/mobile/src/app/(features)/profile/index.tsx
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Avatar from '../../../lib/ui/Avatar';
import { LanguagePicker } from '../../../lib/ui/LanguagePicker';
import { Card, Item, PrimaryButton, Section } from '../../../lib/ui/primitives';
import { ThemePicker } from '../../../lib/ui/ThemePicker';

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { t } = useTranslation();

  return (
    <View className="flex-1 bg-surface dark:bg-surface-dark">
      <ScrollView
        contentContainerStyle={{
          padding: 16,
          paddingBottom: 24 + insets.bottom,
        }}
        showsVerticalScrollIndicator={false}
      >
        <Card style={{ alignItems: 'center', gap: 8 }}>
          <Avatar size={96} />
          <Text className="text-[20px] font-bold text-text dark:text-text-dark mt-2">
            {t('profile.name')}
          </Text>
          <Text className="text-[14px] text-text-dim dark:text-text-dimDark">
            {t('profile.email')}
          </Text>

          <View className="flex-row gap-3 mt-3">
            <PrimaryButton
              label={t('profile.changePhoto')}
              icon="camera-outline"
              onPress={() => {}}
            />
            <PrimaryButton
              label={t('profile.manageVoice')}
              icon="mic-outline"
              onPress={() => {}}
            />
          </View>
        </Card>

        <Section title={t('profile.account')}>
          <Item
            label={t('profile.personalDetails')}
            icon="person-outline"
            onPress={() => router.push('/profile/personal-details')}
          />
          <Item
            label={t('profile.security')}
            icon="shield-checkmark-outline"
            onPress={() => {}}
          />
          <Item
            label={t('profile.connectedApps')}
            icon="link-outline"
            onPress={() => {}}
          />
        </Section>

        <Section title={t('profile.preferences')}>
          <ThemePicker />
          <Item label={t('settings.voiceMode')} icon="volume-high-outline" />
          <Item
            label={t('settings.notifications')}
            icon="notifications-outline"
          />
          <LanguagePicker />
        </Section>
      </ScrollView>
    </View>
  );
}
