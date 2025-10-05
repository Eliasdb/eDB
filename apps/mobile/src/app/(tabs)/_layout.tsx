import { useThemePreference } from '@ui/providers';
import { Tabs, useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';

import { Ionicons } from '@expo/vector-icons';
import { AppHeader } from '@ui/navigation';
import { NavigationTabBar } from '../../lib/ui/navigation';

export default function TabsLayout() {
  const router = useRouter();
  const { effective } = useThemePreference();
  const dark = effective === 'dark';
  const { t } = useTranslation();

  const primary = '#6C63FF';
  const inactive = dark ? '#9CA3AF' : '#6B7280';
  const bg = dark ? '#1F2937' : '#FFFFFF';
  const border = dark ? '#374151' : '#E5E7EB';

  const go = (path: string, opts?: { replace?: boolean }) =>
    opts?.replace ? router.replace(path) : router.push(path);

  return (
    <Tabs
      tabBar={(props) => <NavigationTabBar {...props} />}
      screenOptions={{
        tabBarActiveTintColor: primary,
        tabBarInactiveTintColor: inactive,
        tabBarStyle: {
          backgroundColor: bg,
          borderTopColor: border,
          borderTopWidth: 0.5,
        },
      }}
    >
      <Tabs.Screen
        name="chat"
        options={{
          header: () => (
            <AppHeader
              title={t('tabs.chat', 'Chat')}
              leadingKey="chat"
              onNavigate={go}
            />
          ),
          title: t('tabs.chat', 'Chat'),
          tabBarIcon: ({ color, size }) => (
            <Ionicons
              name="chatbubble-ellipses-outline"
              size={size}
              color={color}
            />
          ),
          tabBarAccessibilityLabel: 'tab-chat',
        }}
      />

      <Tabs.Screen
        name="crm"
        options={{
          header: () => (
            <AppHeader
              title={t('tabs.crm', 'CRM')}
              leadingKey="crm"
              onNavigate={go}
            />
          ),
          title: t('tabs.crm', 'CRM'),
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="checkmark-done-outline" size={size} color={color} />
          ),
          tabBarAccessibilityLabel: 'tab-crm',
        }}
      />

      <Tabs.Screen
        name="index"
        options={{
          header: () => (
            <AppHeader
              title={t('tabs.clara', 'Clara')}
              leadingKey="clara"
              onNavigate={go}
            />
          ),
          title: t('tabs.clara', 'Clara'),
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="sparkles-outline" size={size} color={color} />
          ),
          tabBarAccessibilityLabel: 'tab-clara',
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          header: () => (
            <AppHeader
              title={t('tabs.profile', 'Profile')}
              leadingKey="profile"
              onNavigate={go}
            />
          ),
          title: t('tabs.profile', 'Profile'),
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-circle-outline" size={size} color={color} />
          ),
          tabBarAccessibilityLabel: 'tab-profile',
        }}
      />

      <Tabs.Screen
        name="admin"
        options={{
          header: () => (
            <AppHeader
              title={t('tabs.admin', 'Admin')}
              leadingKey="admin"
              onNavigate={go}
            />
          ),
          title: t('tabs.admin', 'Admin'),
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="terminal-outline" size={size} color={color} />
          ),
          tabBarAccessibilityLabel: 'tab-admin',
        }}
      />
    </Tabs>
  );
}
