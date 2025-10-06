// apps/mobile/src/lib/ui/ThemePicker.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { ThemePicker } from './theme-picker';

/**
 * If your Storybook wraps with `ThemePreferenceProvider` already,
 * `Default` will just work. Otherwise use `Mocked` to demo it locally.
 */

const meta: Meta<typeof ThemePicker> = {
  title: 'Widgets/ThemePicker',
  component: ThemePicker,
  decorators: [(Story) => <Story />],
  parameters: {
    docs: {
      description: {
        component:
          'ThemePicker lists theme modes (system, light, dark) and lets the user select one. Uses your `useThemePreference` hook to persist the choice.',
      },
    },
  },
};
export default meta;

type Story = StoryObj<typeof ThemePicker>;

export const Default: Story = {
  render: () => <ThemePicker />,
};
