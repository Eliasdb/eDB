// apps/mobile/src/app/(features)/profile/index.tsx
import { useRouter } from 'expo-router';
import { ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Avatar from '../../../lib/ui/Avatar';
import { Card, Item, PrimaryButton, Section } from '../../../lib/ui/primitives';
import { ThemePicker } from '../../../lib/ui/ThemePicker';

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const name = 'Elias De Bock';
  const email = 'elias@example.com';

  return (
    <View className="flex-1 bg-surface dark:bg-surface-dark">
      <ScrollView
        contentContainerStyle={{
          padding: 16,
          paddingBottom: 24 + insets.bottom,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile card */}
        <Card style={{ alignItems: 'center', gap: 8 }}>
          <Avatar size={96} />
          <Text className="text-[20px] font-bold text-text dark:text-text-dark mt-2">
            {name}
          </Text>
          <Text className="text-[14px] text-text-dim dark:text-text-dimDark">
            {email}
          </Text>

          <View className="flex-row gap-3 mt-3">
            <PrimaryButton
              label="Change photo"
              icon="camera-outline"
              onPress={() => {}}
            />
            <PrimaryButton
              label="Manage voice"
              icon="mic-outline"
              onPress={() => {}}
            />
          </View>
        </Card>

        {/* Account section */}
        <Section title="Account">
          <Item
            label="Personal details"
            icon="person-outline"
            onPress={() => router.push('/profile/personal-details')}
          />
          <Item
            label="Security"
            icon="shield-checkmark-outline"
            onPress={() => {}}
          />
          <Item label="Connected apps" icon="link-outline" onPress={() => {}} />
        </Section>

        {/* Preferences section */}
        <Section title="Preferences">
          <ThemePicker />
          <Item label="Voice mode" icon="volume-high-outline" />
          <Item label="Notifications" icon="notifications-outline" />
          <Item
            label="Language"
            value="English (US)"
            icon="globe-outline"
            onPress={() => {}}
          />
        </Section>
      </ScrollView>
    </View>
  );
}
