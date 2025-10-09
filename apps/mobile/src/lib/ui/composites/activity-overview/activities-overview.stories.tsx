// libs/ui/composites/activity/activities-overview.stories.tsx
import { Ionicons } from '@expo/vector-icons';
import { action } from '@storybook/addon-actions';
import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Pressable, Text, View } from 'react-native';

import type { Activity } from '@api/core/types';
import {
  ActivitiesOverview,
  type ActivitiesOverviewProps,
} from './activities-overview';

// --- Mock data helpers -------------------------------------------------------
const nowISO = () => new Date().toISOString();
const minsAgo = (m: number) => new Date(Date.now() - m * 60_000).toISOString();
const hoursAgo = (h: number) =>
  new Date(Date.now() - h * 3_600_000).toISOString();

const demoActivities: Activity[] = [
  {
    id: 'a1',
    type: 'email',
    at: minsAgo(12),
    summary: 'Sent pricing proposal to Jane',
    contactId: 'c1',
    companyId: 'co1',
  },
  {
    id: 'a2',
    type: 'call',
    at: hoursAgo(3),
    summary: 'Call with CTO — discussed SSO & SCIM',
    companyId: 'co1',
  },
  {
    id: 'a3',
    type: 'note',
    at: hoursAgo(6),
    summary: 'Internal note: high intent, move to proposal',
    companyId: 'co1',
  },
  {
    id: 'a4',
    type: 'meeting',
    at: hoursAgo(22),
    summary: 'Discovery meeting with ops team',
    companyId: 'co1',
  },
];

// --- Header action (Add note) ------------------------------------------------
function AddNoteButton() {
  return (
    <Pressable
      onPress={action('add-note')}
      className="flex-row items-center gap-1 px-3 py-1.5 rounded-md"
      style={{
        backgroundColor: 'rgba(108,99,255,0.12)',
        borderWidth: 1,
        borderColor: 'rgba(108,99,255,0.26)',
      }}
    >
      <Ionicons name="add-outline" size={16} color="#6C63FF" />
      <Text style={{ color: '#6C63FF', fontSize: 12, fontWeight: '700' }}>
        Add note
      </Text>
    </Pressable>
  );
}

// --- Meta --------------------------------------------------------------------
const meta: Meta<ActivitiesOverviewProps> = {
  title: 'Composites/CRM/Activities Overview',
  component: ActivitiesOverview,
  decorators: [
    (Story) => (
      <View style={{ padding: 16, backgroundColor: 'rgba(0,0,0,0.02)' }}>
        <Story />
      </View>
    ),
  ],
  args: {
    title: 'Timeline',
    activities: demoActivities,
  },
  argTypes: {
    title: { control: 'text' },
    emptyText: { control: 'text' },
    // React nodes shouldn't be controlled as args
    headerActions: { control: false },
  },
};
export default meta;

type Story = StoryObj<ActivitiesOverviewProps>;

// --- Stories -----------------------------------------------------------------
export const Basic: Story = {};

export const WithHeaderAction: Story = {
  // Use render so headerActions (a React node) isn’t serialized in args
  render: (args) => (
    <ActivitiesOverview {...args} headerActions={<AddNoteButton />} />
  ),
};

export const EmptyState: Story = {
  args: {
    activities: [],
    emptyText: 'No activity yet',
  },
};

export const CustomSecondaryFormat: Story = {
  args: {
    renderSecondary: (a) => {
      const dt = new Date(a.at);
      const hours = dt.getHours().toString().padStart(2, '0');
      const mins = dt.getMinutes().toString().padStart(2, '0');
      const today = new Date();
      const isToday =
        dt.getDate() === today.getDate() &&
        dt.getMonth() === today.getMonth() &&
        dt.getFullYear() === today.getFullYear();
      const day = isToday ? 'Today' : dt.toLocaleDateString();
      return `${a.type.toUpperCase()} • ${day} ${hours}:${mins}`;
    },
  },
};

export const ClickableRows: Story = {
  args: {
    onPressItem: (a) => action('onPressItem')(a),
  },
};

export const CustomIconsPerType: Story = {
  args: {
    iconForType: (t) => {
      switch (t) {
        case 'note':
          return 'create-outline';
        case 'call':
          return 'call-outline';
        case 'email':
          return 'send-outline';
        case 'meeting':
          return 'videocam-outline';
        case 'status':
          return 'checkbox-outline';
        case 'system':
        default:
          return 'information-circle-outline';
      }
    },
  },
};

export const LongList: Story = {
  args: {
    activities: [
      ...demoActivities,
      ...demoActivities.map((d, i) => ({
        ...d,
        id: `clone-${i}`,
        at: nowISO(),
        summary: `${d.summary} (copy ${i + 1})`,
      })),
    ],
  },
};
