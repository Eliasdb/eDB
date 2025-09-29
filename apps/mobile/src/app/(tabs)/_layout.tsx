// i18n
import { useTranslation } from 'react-i18next';

// Icons
import { Ionicons } from '@expo/vector-icons';

// UI
import { AppHeader } from '@ui/layout';
import { NavigationTabBar } from '@ui/navigation';
import { useThemePreference } from '@ui/providers';

import { Tabs } from 'expo-router';

export default function TabsLayout() {
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
          <AppHeader title={(options.title as string) ?? ''} />
        ),
        // These tints are read by the adapter for active/inactive colors
        tabBarActiveTintColor: primary,
        tabBarInactiveTintColor: inactive,
        tabBarStyle: {
          backgroundColor: bg,
          borderTopColor: border,
        },
      }}
    >
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
