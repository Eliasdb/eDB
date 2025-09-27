// apps/mobile/src/app/(tabs)/_layout.tsx
import { Ionicons } from '@expo/vector-icons';
import { AppHeader } from '@ui';
import { useThemePreference } from '@ui/themePreference';
import { Tabs } from 'expo-router';

export default function TabsLayout() {
  const { effective } = useThemePreference();
  const dark = effective === 'dark';

  return (
    <Tabs
      screenOptions={{
        header: ({ options }) => (
          <AppHeader title={(options.title as string) ?? ''} />
        ),
        tabBarActiveTintColor: '#6C63FF', // primary
        tabBarInactiveTintColor: dark ? '#9CA3AF' : '#6B7280', // gray-400 / gray-500
        tabBarStyle: {
          backgroundColor: dark ? '#1F2937' : '#FFFFFF', // bg-surface / bg-surface-dark
          borderTopColor: dark ? '#374151' : '#E5E7EB', // border
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Clara',
          tabBarLabel: 'Home',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="chat"
        options={{
          title: 'Chat',
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
          title: 'Tasks',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="checkmark-done-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="settings-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-circle-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="admin-logs"
        options={{
          title: 'Admin',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="terminal-outline" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
