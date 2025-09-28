// apps/mobile/src/app/(tabs)/_layout.tsx
import { Ionicons } from '@expo/vector-icons';
import { AppHeader } from '@ui';
import { useThemePreference } from '@ui/themePreference';
import { Tabs } from 'expo-router';
import { useTranslation } from 'react-i18next';

export default function TabsLayout() {
  const { effective } = useThemePreference();
  const dark = effective === 'dark';
  const { t } = useTranslation();

  // palette mapped to your tokens
  const primary = '#6C63FF';
  const inactive = dark ? '#9CA3AF' : '#6B7280'; // gray-400 / gray-500
  const bg = dark ? '#1F2937' : '#FFFFFF'; // surface-dark / surface
  const border = dark ? '#374151' : '#E5E7EB'; // border-dark / border

  return (
    <Tabs
      screenOptions={{
        header: ({ options }) => (
          <AppHeader title={(options.title as string) ?? ''} />
        ),
        tabBarActiveTintColor: primary,
        tabBarInactiveTintColor: inactive,
        tabBarStyle: {
          backgroundColor: bg,
          borderTopColor: border,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: t('tabs.clara', 'Clara'),
          tabBarLabel: t('tabs.home', 'Home'),
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />
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
        name="tasks"
        options={{
          // renamed here
          title: t('tabs.crm', 'CRM'),
          tabBarLabel: t('tabs.crm', 'CRM'),
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="checkmark-done-outline" size={size} color={color} />
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
