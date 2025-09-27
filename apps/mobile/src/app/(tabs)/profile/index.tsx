import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  Appearance,
  ScrollView,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Avatar from '../../../lib/ui/Avatar';
import {
  Card,
  Item,
  ItemSwitch,
  PrimaryButton,
  Section,
} from '../../../lib/ui/primitives';

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const systemScheme = useColorScheme();
  const [darkMode, setDarkMode] = useState(systemScheme === 'dark');

  useEffect(() => {
    const sub = Appearance.addChangeListener(({ colorScheme }) => {
      setDarkMode((prev) => (prev && colorScheme === 'dark' ? true : prev));
    });
    return () => sub.remove();
  }, []);

  const name = 'Elias De Bock';
  const email = 'elias@example.com';

  return (
    <View style={styles.screen}>
      <ScrollView
        contentContainerStyle={{
          padding: 16,
          paddingBottom: 24 + insets.bottom,
        }}
        showsVerticalScrollIndicator={false}
      >
        <Card style={{ alignItems: 'center', gap: 8 }}>
          <Avatar size={96} />
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.email}>{email}</Text>

          <View style={{ flexDirection: 'row', gap: 12, marginTop: 12 }}>
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

        <Section title="Preferences">
          <ItemSwitch
            label="Dark mode"
            icon="moon-outline"
            value={darkMode}
            onValueChange={setDarkMode}
          />
          <ItemSwitch label="Voice mode" icon="volume-high-outline" />
          <ItemSwitch label="Notifications" icon="notifications-outline" />
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

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#f6f7fb' },
  name: { fontSize: 20, fontWeight: '700', color: '#111', marginTop: 8 },
  email: { fontSize: 14, color: '#666' },
});
