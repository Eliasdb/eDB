// apps/mobile/src/lib/ui/primitives/icon-button.stories.tsx
import { action } from '@storybook/addon-actions';
import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Text, View } from 'react-native';
import { IconButton } from './icon-button';

const meta: Meta<typeof IconButton> = {
  title: 'Primitives/Buttons/Icon Button',
  component: IconButton,
  args: {
    name: 'add',
    tint: 'primary',
    variant: 'ghost',
    size: 'xs',
    subtleBg: true,
    disabled: false,
  },
  argTypes: {
    name: {
      control: 'text',
      description: 'Ionicons name',
    },
    tint: {
      control: 'inline-radio',
      options: ['primary', 'danger', 'success', 'neutral'],
    },
    variant: {
      control: 'inline-radio',
      options: ['ghost', 'solid', 'outline'],
    },
    size: {
      control: 'inline-radio',
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
    },
    subtleBg: { control: 'boolean' },
    onPress: { action: 'onPress' },
  },
  decorators: [
    (Story) => (
      <View style={{ padding: 24, gap: 16, alignItems: 'flex-start' }}>
        <Story />
      </View>
    ),
  ],
};
export default meta;

type Story = StoryObj<typeof IconButton>;

export const Default: Story = {
  args: {
    name: 'add',
    onPress: action('press'),
  },
};

export const Variants: Story = {
  render: (args) => (
    <View style={{ gap: 14 }}>
      <Row label="Ghost (soft bg)">
        <IconButton
          {...args}
          name="add"
          variant="ghost"
          subtleBg
          onPress={action('ghost subtle')}
        />
        <IconButton
          {...args}
          name="add"
          variant="ghost"
          subtleBg={false}
          onPress={action('ghost plain')}
        />
      </Row>
      <Row label="Solid">
        <IconButton
          {...args}
          name="checkmark"
          variant="solid"
          tint="success"
          onPress={action('solid success')}
        />
        <IconButton
          {...args}
          name="alert"
          variant="solid"
          tint="danger"
          onPress={action('solid danger')}
        />
        <IconButton
          {...args}
          name="notifications"
          variant="solid"
          tint="primary"
          onPress={action('solid primary')}
        />
      </Row>
      <Row label="Outline">
        <IconButton
          {...args}
          name="chatbubble-ellipses-outline"
          variant="outline"
          tint="neutral"
          onPress={action('outline neutral')}
        />
        <IconButton
          {...args}
          name="heart-outline"
          variant="outline"
          tint="danger"
          onPress={action('outline danger')}
        />
      </Row>
    </View>
  ),
};

export const Sizes: Story = {
  render: (args) => (
    <View style={{ gap: 12 }}>
      <Row label="xs">
        <IconButton {...args} size="xs" name="add" onPress={action('xs')} />
      </Row>
      <Row label="sm">
        <IconButton {...args} size="sm" name="add" onPress={action('sm')} />
      </Row>
      <Row label="md">
        <IconButton {...args} size="md" name="add" onPress={action('md')} />
      </Row>
      <Row label="lg">
        <IconButton {...args} size="lg" name="add" onPress={action('lg')} />
      </Row>
      <Row label="xl">
        <IconButton {...args} size="xl" name="add" onPress={action('xl')} />
      </Row>
    </View>
  ),
};

export const TintMatrix: Story = {
  render: () => {
    const tints = ['primary', 'success', 'danger', 'neutral'] as const;
    const variants = ['ghost', 'solid', 'outline'] as const;
    return (
      <View style={{ gap: 18 }}>
        {variants.map((variant) => (
          <View key={variant} style={{ gap: 8 }}>
            <Text style={{ fontWeight: '600' }}>{variant}</Text>
            <View style={{ flexDirection: 'row', gap: 10, flexWrap: 'wrap' }}>
              {tints.map((t) => (
                <IconButton
                  key={`${variant}-${t}`}
                  name={
                    t === 'danger'
                      ? 'alert'
                      : t === 'success'
                        ? 'checkmark'
                        : 'add'
                  }
                  tint={t}
                  variant={variant}
                  size="sm"
                  subtleBg={variant === 'ghost'}
                  onPress={action(`${variant}-${t}`)}
                />
              ))}
            </View>
          </View>
        ))}
      </View>
    );
  },
};

export const DisabledState: Story = {
  args: {
    name: 'close',
    variant: 'ghost',
    subtleBg: true,
    disabled: true,
  },
};

export const ToolbarRow: Story = {
  render: () => (
    <View
      style={{
        height: 56,
        paddingHorizontal: 12,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        backgroundColor: 'rgba(0,0,0,0.04)',
      }}
    >
      <IconButton name="arrow-back" onPress={action('back')} />
      <View style={{ flex: 1 }} />
      <IconButton name="search" onPress={action('search')} />
      <IconButton
        name="add"
        variant="solid"
        tint="primary"
        size="sm"
        onPress={action('add')}
      />
      <IconButton
        name="ellipsis-vertical"
        subtleBg={false}
        variant="ghost"
        onPress={action('more')}
      />
    </View>
  ),
};

/* helpers */
function Row({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <View style={{ gap: 6 }}>
      <Text style={{ fontWeight: '600' }}>{label}</Text>
      <View style={{ flexDirection: 'row', gap: 10, flexWrap: 'wrap' }}>
        {children}
      </View>
    </View>
  );
}
