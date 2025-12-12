// apps/mobile/src/lib/ui/primitives/button.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { View } from 'react-native';
import { Button, type ButtonProps } from './button';

const meta: Meta<typeof Button> = {
  title: 'Primitives/Buttons/Button',
  component: Button,
  args: {
    label: 'Press me',
    tint: 'primary',
    variant: 'solid',
    shape: 'pill',
    size: 'md',
    disabled: false,
    loading: false,
    fullWidth: false,
    webDensity: 'compact',
  },
  argTypes: {
    tint: {
      control: 'inline-radio',
      options: ['primary', 'danger', 'success', 'neutral'],
    },
    variant: {
      control: 'inline-radio',
      options: ['solid', 'outline', 'ghost'],
    },
    shape: {
      control: 'inline-radio',
      options: ['pill', 'rounded', 'circle'],
    },
    size: {
      control: 'inline-radio',
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
    },
    icon: {
      control: 'select',
      options: [undefined, 'add', 'checkmark', 'close', 'heart', 'sparkles'],
    },
    iconLeft: {
      control: 'select',
      options: [undefined, 'chevron-back', 'search', 'call'],
    },
    iconRight: {
      control: 'select',
      options: [undefined, 'chevron-forward', 'arrow-forward', 'send'],
    },
    webDensity: {
      control: 'inline-radio',
      options: ['compact', 'comfortable'],
    },
  },
  decorators: [
    (Story) => (
      <View style={{ padding: 16, gap: 12 }}>
        <Story />
      </View>
    ),
  ],
};
export default meta;

type Story = StoryObj<typeof Button>;

/* --- Simple variants ----------------------------------------------------- */

export const SolidPrimary: Story = {
  args: { label: 'Continue', tint: 'primary', variant: 'solid' },
};

export const OutlineNeutral: Story = {
  args: { label: 'Secondary', tint: 'neutral', variant: 'outline' },
};

export const GhostDanger: Story = {
  args: {
    label: 'Delete',
    tint: 'danger',
    variant: 'ghost',
    iconLeft: 'trash',
  },
};

export const SuccessWithIconRight: Story = {
  args: { label: 'Saved', tint: 'success', iconRight: 'checkmark' },
};

export const Disabled: Story = {
  args: {
    label: 'Disabled',
    disabled: true,
    variant: 'outline',
    tint: 'neutral',
  },
};

export const Loading: Story = {
  args: { label: 'Loading', loading: true, tint: 'primary' },
};

export const FullWidth: Story = {
  args: {
    label: 'Take action',
    fullWidth: true,
    variant: 'solid',
    tint: 'primary',
  },
};

export const CircleIcon: Story = {
  args: {
    shape: 'circle',
    variant: 'solid',
    tint: 'primary',
    icon: 'add',
    size: 'md',
  },
};

/* --- Size matrix --------------------------------------------------------- */

export const Sizes: Story = {
  render: (args) => (
    <View style={{ gap: 12 }}>
      <View style={{ flexDirection: 'row', gap: 12, flexWrap: 'wrap' }}>
        {(['xs', 'sm', 'md', 'lg', 'xl'] as ButtonProps['size'][]).map((s) => (
          <Button key={s} {...args} size={s} label={`Size ${s}`} />
        ))}
      </View>
      <View style={{ flexDirection: 'row', gap: 12, flexWrap: 'wrap' }}>
        {(['xs', 'sm', 'md', 'lg', 'xl'] as ButtonProps['size'][]).map((s) => (
          <Button
            key={`icon-${s}`}
            {...args}
            size={s}
            shape="circle"
            icon="heart"
          />
        ))}
      </View>
    </View>
  ),
  args: { tint: 'primary', variant: 'solid' },
};

/* --- Gallery (tones x variants) ----------------------------------------- */

export const Gallery: Story = {
  render: () => {
    const tints: ButtonProps['tint'][] = [
      'primary',
      'success',
      'danger',
      'neutral',
    ];
    const variants: ButtonProps['variant'][] = ['solid', 'outline', 'ghost'];

    return (
      <View style={{ gap: 16 }}>
        {variants.map((variant) => (
          <View key={variant} style={{ gap: 12 }}>
            <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap' }}>
              {tints.map((t) => (
                <Button
                  key={`${variant}-${t}`}
                  label={`${variant}/${t}`}
                  tint={t}
                  variant={variant}
                  size="md"
                />
              ))}
            </View>
          </View>
        ))}
        <View style={{ flexDirection: 'row', gap: 12, flexWrap: 'wrap' }}>
          <Button
            label="Back"
            tint="neutral"
            variant="outline"
            iconLeft="chevron-back"
          />
          <Button
            label="Next"
            tint="primary"
            variant="solid"
            iconRight="chevron-forward"
          />
          <Button
            label="Search"
            tint="neutral"
            variant="ghost"
            iconLeft="search"
          />
        </View>
      </View>
    );
  },
};

/* --- Density (web only visual) ------------------------------------------ */

export const WebDensity: Story = {
  render: () => (
    <View style={{ gap: 12 }}>
      <Button label="Compact" webDensity="compact" />
      <Button label="Comfortable" webDensity="comfortable" />
    </View>
  ),
  args: { tint: 'primary', variant: 'solid' },
};
