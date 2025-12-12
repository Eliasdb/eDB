// libs/ui/composites/activity/activity-timeline.stories.tsx
import { action } from '@storybook/addon-actions';
import type { Meta, StoryObj } from '@storybook/react';
import { View } from 'react-native';

import { Button } from '../../primitives';
import {
  ActivityTimeline,
  type ActivityLike,
  type ActivityTimelineProps,
} from './activity-timeline';

// --- demo data ---------------------------------------------------------------

const now = new Date();
const iso = (d: Date) => d.toISOString();

// helpers for relative times
const minutesAgo = (m: number) => iso(new Date(now.getTime() - m * 60_000));
const hoursAgo = (h: number) => iso(new Date(now.getTime() - h * 3_600_000));
const daysAgo = (dys: number) =>
  iso(new Date(now.getFullYear(), now.getMonth(), now.getDate() - dys, 14, 15));

const demoActivities: ActivityLike[] = [
  // today
  {
    id: 'a1',
    type: 'email',
    at: minutesAgo(15),
    summary: 'Sent pricing proposal to Jane',
  },
  {
    id: 'a2',
    type: 'call',
    at: hoursAgo(2),
    summary: 'Call with CTO — discussed SSO & SCIM',
  },
  {
    id: 'a3',
    type: 'note',
    at: hoursAgo(6),
    summary: 'Internal note: high intent, move to proposal',
  },

  // yesterday
  {
    id: 'a4',
    type: 'meeting',
    at: daysAgo(1),
    summary: 'Discovery meeting with ops team',
  },

  // earlier
  {
    id: 'a5',
    type: 'status',
    at: daysAgo(3),
    summary: 'Advanced to "Proposal" stage',
  },
  {
    id: 'a6',
    type: 'system',
    at: daysAgo(7),
    summary: 'Account imported from HubSpot',
  },
];

// --- meta --------------------------------------------------------------------

const meta: Meta<typeof ActivityTimeline> = {
  title: 'UI/Composites/Activity/ActivityTimeline',
  component: ActivityTimeline,
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
    emptyText: 'No activity yet',
  },
  argTypes: {
    title: { control: 'text' },
    emptyText: { control: 'text' },
  },
};
export default meta;

type Story = StoryObj<typeof ActivityTimeline>;

// --- stories -----------------------------------------------------------------

export const Basic: Story = {};

export const LoadingEmpty: Story = {
  args: {
    activities: [],
    loading: true,
  },
};

export const WithHeaderAction: Story = {
  args: {
    // keep args serializable; inject node via render()
  },
  render: (args: ActivityTimelineProps<ActivityLike>) => (
    <ActivityTimeline
      {...args}
      headerActions={
        <Button
          variant="outline"
          tint="primary"
          shape="rounded"
          size="xs"
          label="Add note"
          iconLeft="add-outline"
          style={{
            backgroundColor: 'rgba(108,99,255,0.12)',
            borderColor: 'rgba(108,99,255,0.26)',
            borderWidth: 1,
            borderRadius: 10,
          }}
          onPress={() => action('add-note')()}
        />
      }
    />
  ),
};

export const ClickableRows: Story = {
  args: {},
  render: (args: ActivityTimelineProps<ActivityLike>) => (
    <ActivityTimeline {...args} onPressItem={(a) => action('onPressItem')(a)} />
  ),
};

export const CustomSecondary: Story = {
  args: {},
  render: (args: ActivityTimelineProps<ActivityLike>) => (
    <ActivityTimeline
      {...args}
      renderSecondary={(a) => {
        // Example: “EMAIL • Today 14:05”
        const dt = new Date(a.at);
        const hours = String(dt.getHours()).padStart(2, '0');
        const mins = String(dt.getMinutes()).padStart(2, '0');
        const today = new Date();
        const isToday =
          dt.getDate() === today.getDate() &&
          dt.getMonth() === today.getMonth() &&
          dt.getFullYear() === today.getFullYear();
        const day = isToday ? 'Today' : dt.toLocaleDateString();
        return `${a.type.toUpperCase()} • ${day} ${hours}:${mins}`;
      }}
    />
  ),
};

export const CustomIconsPerType: Story = {
  args: {},
  render: (args: ActivityTimelineProps<ActivityLike>) => (
    <ActivityTimeline
      {...args}
      iconForType={(t) => {
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
      }}
    />
  ),
};

export const ManyItems: Story = {
  args: {
    activities: [
      ...demoActivities,
      ...demoActivities.map((d, i) => ({
        ...d,
        id: `clone-${i}`,
        at: now.toISOString(),
        summary: `${d.summary} (copy ${i + 1})`,
      })),
    ],
  },
};
