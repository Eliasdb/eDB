// apps/mobile/src/lib/ui/LanguagePicker.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { View } from 'react-native';
import { LanguagePicker } from './language-picker';

// Mock i18n context for Storybook
// If you already provide an I18nextProvider globally in preview.js, you can drop this
const Wrapper = ({ children }: { children: React.ReactNode }) => {
  return <View style={{ flex: 1, padding: 16 }}>{children}</View>;
};

const meta: Meta<typeof LanguagePicker> = {
  title: 'Widgets/LanguagePicker',
  component: LanguagePicker,
  decorators: [
    (Story) => (
      <Wrapper>
        <Story />
      </Wrapper>
    ),
  ],
  parameters: {
    docs: {
      description: {
        component:
          'LanguagePicker shows available locales and allows switching. It highlights the active one with a filled circle.',
      },
    },
  },
};
export default meta;

type Story = StoryObj<typeof LanguagePicker>;

export const Default: Story = {
  render: () => <LanguagePicker />,
};

const SimulatedSwitchRender = () => (
  <View style={{ borderWidth: 1, borderColor: '#ddd', borderRadius: 8 }}>
    <LanguagePicker />
  </View>
);

export const SimulatedSwitch: Story = {
  render: () => <SimulatedSwitchRender />,
};
