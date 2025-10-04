// apps/mobile/src/lib/ui/primitives/bottom-nav.stories.tsx
import { Ionicons } from '@expo/vector-icons';
import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { View } from 'react-native';
import BottomNav, { type BottomNavItem } from './bottom-nav';

// Small helper so icons respect the provided color/size/focused
const tabIcon =
  (name: React.ComponentProps<typeof Ionicons>['name']) =>
  ({ color, size }: { color: string; size: number; focused: boolean }) => (
    <Ionicons name={name} size={size} color={color} />
  );

const meta: Meta<typeof BottomNav> = {
  title: 'Navigation/ Bottom Nav',
  component: BottomNav,
  args: {
    activeTint: '#6C63FF',
    inactiveTint: '#6B7280',
    iconSize: 22,
    elevate: true,
    roundedActive: true,
  },
  decorators: [
    (Story) => (
      // phone frame-ish
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
        {/* content area */}
        <View style={{ flex: 1 }} />
        {/* nav */}
        <Story />
      </View>
    ),
  ],
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

/* ---------------- Basic ---------------- */

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

/* ---------------- With badges ---------------- */

export const WithBadges: Story = {
  render: (args) => {
    const [active, setActive] = useState('tasks');
    const BadgeIcon =
      (
        name: React.ComponentProps<typeof Ionicons>['name'],
        badge?: number | string | boolean,
      ) =>
      ({ color, size }: { color: string; size: number; focused: boolean }) => (
        <View style={{}}>
          <Ionicons name={name} size={size} color={color} />
          {badge ? (
            <View
              style={{
                position: 'absolute',
                right: -8,
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
                <Ionicons
                  // a tiny text-like glyph; simple & visible on RN without extra Text
                  name="ellipse"
                  size={0.01}
                  color="transparent"
                />
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
        icon: BadgeIcon('checkbox-outline', 3),
        badge: 3,
      },
      {
        key: 'crm',
        label: 'CRM',
        icon: BadgeIcon('briefcase-outline', true), // dot-only
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

/* ---------------- Dark mode preview ---------------- */

export const DarkMode: Story = {
  parameters: { backgrounds: { default: 'dark' } },
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
      <View style={{ backgroundColor: '#0b0c0f' }}>
        <BottomNav
          {...args}
          items={items}
          activeKey={active}
          onChange={setActive}
          // nudge tints for dark bg if you like
          activeTint="#8B85FF"
          inactiveTint="#a3a3a3"
        />
      </View>
    );
  },
};
