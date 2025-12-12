// apps/mobile/src/lib/ui/LanguagePicker.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';
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

export const SimulatedSwitch: Story = {
  render: () => {
    const [lang, setLang] = useState<'en' | 'nl'>('en');

    // Mocked component that overrides setLocale + i18n.language
    const Mocked = () => {
      const i18n = {
        language: lang,
        t: (key: string) => {
          if (key === 'languages.en') return 'English';
          if (key === 'languages.nl') return 'Nederlands';
          return key;
        },
      } as any;

      const setLocale = (code: 'en' | 'nl') => setLang(code);

      return (
        <View style={{ borderWidth: 1, borderColor: '#ddd', borderRadius: 8 }}>
          {/* Inject fake i18n via context override if needed */}
          <LanguagePicker />
        </View>
      );
    };

    return <Mocked />;
  },
};
