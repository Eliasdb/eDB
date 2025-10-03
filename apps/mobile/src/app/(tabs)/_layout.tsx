// apps/mobile/src/app/(tabs)/_layout.tsx
import { Ionicons } from '@expo/vector-icons';
import { AppHeader, NavigationTabBar } from '@ui/navigation';
import { useThemePreference } from '@ui/providers';
import { Tabs, useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';

export default function TabsLayout() {
  const router = useRouter();
  const { effective } = useThemePreference();
  const dark = effective === 'dark';
  const { t } = useTranslation();

  const primary = '#6C63FF';
  const inactive = dark ? '#9CA3AF' : '#6B7280';
  const bg = dark ? '#1F2937' : '#FFFFFF';
  const border = dark ? '#374151' : '#E5E7EB';

  return (
    <Tabs
      tabBar={(props) => <NavigationTabBar {...props} />}
      screenOptions={{
        header: ({ options }) => (
          <AppHeader
            title={(options.title as string) ?? ''}
            onNavigate={(path, opts) =>
              opts?.replace ? router.replace(path) : router.push(path)
            }
          />
        ),
        tabBarActiveTintColor: primary,
        tabBarInactiveTintColor: inactive,
        // keep; RN Navigation will anchor to bottom. Background extends via BottomNav.
        tabBarStyle: {
          backgroundColor: bg,
          borderTopColor: border,
          borderTopWidth: 0.5,
        },
      }}
    >
      {/* your screens unchanged */}
      <Tabs.Screen
        name="chat"
        options={{
          title: t('tabs.chat', 'Chat'),
          tabBarIcon: ({ color, size }) => (
            <Ionicons
              name="chatbubble-ellipses-outline"
              size={size}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="crm"
        options={{
          title: t('tabs.crm', 'CRM'),
          tabBarLabel: t('tabs.crm', 'CRM'),
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="checkmark-done-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="index"
        options={{
          title: t('tabs.clara', 'Clara'),
          tabBarLabel: t('tabs.clara', 'Clara'),
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="sparkles-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: t('tabs.profile', 'Profile'),
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-circle-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="admin"
        options={{
          title: t('tabs.admin', 'Admin'),
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="terminal-outline" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
