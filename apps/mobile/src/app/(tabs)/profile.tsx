import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  Appearance,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Avatar from '../components/Avatar'; // adjust if your path differs

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const systemScheme = useColorScheme();
  const [darkMode, setDarkMode] = useState(systemScheme === 'dark');

  const router = useRouter();

  // keep switch in sync if system theme changes while this screen is open
  useEffect(() => {
    const sub = Appearance.addChangeListener(({ colorScheme }) => {
      // only update if user hasn't overridden locally; tweak if you add a real theme provider
      setDarkMode((prev) => (prev && colorScheme === 'dark' ? true : prev));
    });
    return () => sub.remove();
  }, []);

  // demo data
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
        {/* Hero card */}
        <View style={styles.card}>
          <Avatar size={96} />
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.email}>{email}</Text>

          <View style={styles.rowActions}>
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
        </View>

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
          {/* NEW: Dark mode toggle */}
          <ItemSwitch
            label="Dark mode"
            icon="moon-outline"
            value={darkMode}
            onValueChange={(val) => {
              setDarkMode(val);
              // TODO: Hook into your app-wide theme provider or persist to storage here
            }}
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

/* ---------- Reusable bits ---------- */

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <View style={{ marginTop: 20 }}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.sectionCard}>{children}</View>
    </View>
  );
}

function Item({
  label,
  value,
  icon,
  onPress,
  tint = '#333',
  labelStyle,
}: {
  label: string;
  value?: string;
  icon: React.ComponentProps<typeof Ionicons>['name'];
  onPress: () => void;
  tint?: string;
  labelStyle?: object;
}) {
  return (
    <TouchableOpacity style={styles.item} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.itemLeft}>
        <Ionicons name={icon} size={20} color={tint} />
        <Text style={[styles.itemLabel, labelStyle]}>{label}</Text>
      </View>
      <View style={styles.itemRight}>
        {value ? <Text style={styles.itemValue}>{value}</Text> : null}
        <Ionicons name="chevron-forward" size={18} color="#999" />
      </View>
    </TouchableOpacity>
  );
}

function ItemSwitch({
  label,
  icon,
  value,
  onValueChange,
}: {
  label: string;
  icon: React.ComponentProps<typeof Ionicons>['name'];
  value?: boolean;
  onValueChange?: (v: boolean) => void;
}) {
  return (
    <View style={styles.item}>
      <View style={styles.itemLeft}>
        <Ionicons name={icon} size={20} color="#333" />
        <Text style={styles.itemLabel}>{label}</Text>
      </View>
      <Switch value={value} onValueChange={onValueChange} />
    </View>
  );
}

function PrimaryButton({
  label,
  icon,
  onPress,
}: {
  label: string;
  icon: React.ComponentProps<typeof Ionicons>['name'];
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      style={styles.primaryBtn}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Ionicons name={icon} size={18} color="#fff" />
      <Text style={styles.primaryBtnText}>{label}</Text>
    </TouchableOpacity>
  );
}

/* ---------- Styles (full) ---------- */

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#f6f7fb' },

  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    gap: 8,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 2,
  },
  name: { fontSize: 20, fontWeight: '700', color: '#111', marginTop: 8 },
  email: { fontSize: 14, color: '#666' },
  rowActions: { flexDirection: 'row', gap: 12, marginTop: 12 },

  sectionTitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    marginLeft: 4,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  sectionCard: {
    backgroundColor: '#fff',
    borderRadius: 14,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 1,
  },

  item: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#eee',
  },
  itemLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  itemRight: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  itemLabel: { fontSize: 16, color: '#111' },
  itemValue: { fontSize: 14, color: '#666' },

  primaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#6C63FF',
    borderRadius: 22,
    height: 44,
    paddingHorizontal: 14,
  },
  primaryBtnText: { color: '#fff', fontWeight: '600', fontSize: 15 },
});
