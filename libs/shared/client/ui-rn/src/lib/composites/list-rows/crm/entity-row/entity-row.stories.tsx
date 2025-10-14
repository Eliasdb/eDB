// @ui/composites/entity-row.stories.tsx
import { Ionicons } from '@expo/vector-icons';
import { action } from '@storybook/addon-actions';
import type { Meta, StoryObj } from '@storybook/react';
import { View } from 'react-native';
import { EntityRow, type EntityMetaItem, type EntityTag } from './entity-row';

const meta: Meta<typeof EntityRow> = {
  title: 'Composites/List Rows/CRM/Entity Row',
  component: EntityRow,
  decorators: [
    (Story) => (
      <View style={{ padding: 16, backgroundColor: 'rgba(0,0,0,0.02)' }}>
        <Story />
      </View>
    ),
  ],
  args: {
    title: 'Jane Doe',
    subtitle: 'jane@acme.io',
    initials: 'JD',
    avatarShape: 'circle',
  },
  argTypes: {
    avatarShape: {
      control: 'inline-radio',
      options: ['circle', 'rounded'],
    },
    // trailing is a ReactNode; avoid putting it in args (disable control globally)
    trailing: { control: false },
  },
};
export default meta;

type Story = StoryObj<typeof EntityRow>;

/* ------------------------------------------------------------------ */
/* Stories                                                            */
/* ------------------------------------------------------------------ */

export const BasicWithInitials: Story = {
  args: {
    onPress: action('onPress'),
  },
};

export const WithAvatar: Story = {
  args: {
    title: 'Acme Corporation',
    subtitle: 'acme.example',
    avatarUrl: 'https://picsum.photos/seed/acme/96',
    initials: undefined,
    avatarShape: 'rounded',
    onPress: action('onPress'),
  },
};

export const WithTags: Story = {
  args: {
    title: 'John Q Public',
    subtitle: 'johnq@umbrella.io',
    initials: 'JQ',
    tags: [
      { text: 'Prospect', tone: 'primary' },
      { text: 'High Intent', tone: 'success', leftIcon: 'sparkles-outline' },
      { text: 'Enrichment', tone: 'neutral', leftIcon: 'globe-outline' },
    ] as EntityTag[],
    onPress: action('onPress'),
  },
};

export const WithMetaInline: Story = {
  args: {
    title: 'Jane Doe',
    subtitle: 'jane@acme.io',
    initials: 'JD',
    meta: [
      { label: 'Company', value: 'Acme Corp', icon: 'business-outline' },
      { label: 'Title', value: 'Head of Ops', icon: 'briefcase-outline' },
      { label: 'Phone', value: '+1 555-867-5309', icon: 'call-outline' },
    ] as EntityMetaItem[],
  },
};

export const WithMetaPills: Story = {
  args: {
    title: 'Acme Corporation',
    subtitle: 'acme.example',
    initials: 'AC',
    avatarShape: 'rounded',
    meta: [
      { label: 'Stage', value: 'Prospect', pill: true, icon: 'flag-outline' },
      { label: 'ARR', value: '$120k', pill: true, icon: 'cash-outline' },
      { label: 'Region', value: 'EU', pill: true, icon: 'globe-outline' },
    ] as EntityMetaItem[],
  },
};

/** Use `render` to pass a React node for `trailing` (keeps args serializable). */
export const CustomTrailingActions: Story = {
  args: {
    title: 'Jane Doe',
    subtitle: 'jane@acme.io',
    initials: 'JD',
    onPress: action('onPress'),
  },
  render: (args) => (
    <EntityRow
      {...args}
      trailing={
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <Ionicons name="mail-outline" size={18} color="#6B7280" />
          <Ionicons name="call-outline" size={18} color="#6B7280" />
          <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
        </View>
      }
    />
  ),
  parameters: {
    controls: { exclude: ['trailing'] },
  },
};

export const LongTextWrapping: Story = {
  args: {
    title: 'Very Long Company Name That Should Truncate Nicely In The Row',
    subtitle:
      'very.long.email.alias+with+a+bunch+of+stuff@even-longer-domain.example',
    initials: 'VC',
    avatarShape: 'rounded',
    tags: [
      { text: 'Customer', tone: 'success' },
      { text: 'Premium', tone: 'primary' },
    ],
    meta: [
      { label: 'Owner', value: 'Alexandra Montgomery', icon: 'person-outline' },
      { label: 'Industry', value: 'Manufacturing & Logistics' },
    ],
  },
};

export const NoSubtitleOnlyMeta: Story = {
  args: {
    title: 'Umbrella GmbH',
    subtitle: undefined,
    initials: 'UG',
    avatarShape: 'rounded',
    meta: [
      { label: 'Domain', value: 'umbrella.example', icon: 'globe-outline' },
      { label: 'Stage', value: 'Lead', pill: true, icon: 'flag-outline' },
    ],
  },
};
