import { Ionicons } from '@expo/vector-icons';
import type { Decorator, Meta, StoryObj } from '@storybook/react';
import { colorScheme } from 'nativewind';
import { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import BottomNav from './bottom-nav';
import type { BottomNavItemModel as BottomNavItem } from './bottom-nav-item';

/* ---------------- helpers ---------------- */

const tabIcon =
  (name: React.ComponentProps<typeof Ionicons>['name']) =>
  ({ color, size }: { color: string; size: number; focused: boolean }) => (
    <Ionicons name={name} size={size} color={color} />
  );

// Force NativeWind’s theme for a single story (light/dark)
const forceTheme =
  (mode: 'light' | 'dark'): Decorator =>
  (Story) => {
    useEffect(() => {
      const prev = colorScheme.get();
      colorScheme.set(mode);
      return () => colorScheme.set(prev ?? 'light');
    }, []);

    const bg = mode === 'dark' ? '#0b0c0f' : '#f9fafb';
    return (
      <View
        style={{
          height: 640,
          width: 360,
          borderRadius: 24,
          overflow: 'hidden',
          borderWidth: 1,
          borderColor: '#e5e7eb',
          backgroundColor: bg,
          justifyContent: 'flex-end',
        }}
      >
        <View style={{ flex: 1 }} />
        <Story />
      </View>
    );
  };

// “Phone frame” wrapper only (no theme forcing)
const phoneFrame: Decorator = (Story) => (
  <View
    style={{
      height: 640,
      width: 360,
      borderRadius: 24,
      overflow: 'hidden',
      borderWidth: 1,
      borderColor: '#e5e7eb',
      backgroundColor: '#f9fafb',
      justifyContent: 'flex-end',
    }}
  >
    <View style={{ flex: 1 }} />
    <Story />
  </View>
);

/* ---------------- meta ---------------- */

const meta: Meta<typeof BottomNav> = {
  title: 'Navigation/Footers/Bottom Nav',
  component: BottomNav,
  args: {
    activeTint: '#6C63FF',
    inactiveTint: '#6B7280',
    iconSize: 22,
    elevate: true,
    roundedActive: true,
  },
  decorators: [phoneFrame],
  parameters: {
    docs: {
      description: {
        component:
          'Animated bottom navigation with press feedback, focus pop, and optional rounded active tint overlay.',
      },
    },
  },
};
export default meta;

type Story = StoryObj<typeof BottomNav>;

/* ---------------- stories ---------------- */

export const Basic: Story = {
  render: (args) => {
    const [active, setActive] = useState('home');
    const items: BottomNavItem[] = [
      { key: 'home', label: 'Home', icon: tabIcon('home-outline') },
      { key: 'tasks', label: 'Tasks', icon: tabIcon('checkbox-outline') },
      { key: 'crm', label: 'CRM', icon: tabIcon('briefcase-outline') },
      {
        key: 'chat',
        label: 'Chat',
        icon: tabIcon('chatbubble-ellipses-outline'),
      },
      { key: 'settings', label: 'Settings', icon: tabIcon('settings-outline') },
    ];
    return (
      <BottomNav
        {...args}
        items={items}
        activeKey={active}
        onChange={setActive}
      />
    );
  },
};

export const WithBadges: Story = {
  render: (args) => {
    const [active, setActive] = useState('tasks');

    // Simple badge wrapper (dot or number)
    const withBadge =
      (
        name: React.ComponentProps<typeof Ionicons>['name'],
        badge?: number | string | boolean,
      ) =>
      ({ color, size }: { color: string; size: number; focused: boolean }) => (
        <View>
          <Ionicons name={name} size={size} color={color} />
          {badge ? (
            <View
              style={{
                position: 'absolute',
                right: -6,
                top: -4,
                minWidth: 16,
                height: 16,
                paddingHorizontal: 4,
                borderRadius: 8,
                backgroundColor: '#ef4444',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {typeof badge === 'boolean' ? null : (
                <Text
                  style={{
                    fontSize: 10,
                    fontWeight: '700',
                    color: 'white',
                    includeFontPadding: false as any,
                  }}
                >
                  {String(badge)}
                </Text>
              )}
            </View>
          ) : null}
        </View>
      );

    const items: BottomNavItem[] = [
      { key: 'home', label: 'Home', icon: tabIcon('home-outline') },
      {
        key: 'tasks',
        label: 'Tasks',
        icon: withBadge('checkbox-outline', 3),
        badge: 3,
      },
      {
        key: 'crm',
        label: 'CRM',
        icon: withBadge('briefcase-outline', true),
        badge: true,
      },
      {
        key: 'chat',
        label: 'Chat',
        icon: tabIcon('chatbubble-ellipses-outline'),
      },
      { key: 'settings', label: 'Settings', icon: tabIcon('settings-outline') },
    ];

    return (
      <BottomNav
        {...args}
        items={items}
        activeKey={active}
        onChange={setActive}
      />
    );
  },
};

export const DarkMode: Story = {
  decorators: [forceTheme('dark')],
  render: (args) => {
    const [active, setActive] = useState('chat');
    const items: BottomNavItem[] = [
      { key: 'home', label: 'Home', icon: tabIcon('home-outline') },
      { key: 'tasks', label: 'Tasks', icon: tabIcon('checkbox-outline') },
      { key: 'crm', label: 'CRM', icon: tabIcon('briefcase-outline') },
      {
        key: 'chat',
        label: 'Chat',
        icon: tabIcon('chatbubble-ellipses-outline'),
      },
      { key: 'settings', label: 'Settings', icon: tabIcon('settings-outline') },
    ];
    return (
      <BottomNav
        {...args}
        items={items}
        activeKey={active}
        onChange={setActive}
        activeTint="#8B85FF"
        inactiveTint="#A3A3A3"
      />
    );
  },
};
