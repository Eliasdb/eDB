// apps/mobile/src/lib/ui/headerUserMenu.stories.tsx
import { action } from '@storybook/addon-actions';
import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { View } from 'react-native';
import { MenuProvider } from 'react-native-popup-menu';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { HeaderUserMenu } from './header-user-menu';

const meta: Meta<typeof HeaderUserMenu> = {
  title: 'Navigation/Headers/Header User Menu',
  component: HeaderUserMenu,
  args: { toolbarHeight: 56 },
  decorators: [
    (Story) => (
      <SafeAreaProvider>
        <MenuProvider>
          {/* Fake toolbar strip so the trigger looks natural */}
          <View
            style={{
              height: 56,
              paddingHorizontal: 12,
              alignItems: 'flex-end',
              justifyContent: 'center',
              backgroundColor: 'rgba(0,0,0,0.04)',
            }}
          >
            <Story />
          </View>
        </MenuProvider>
      </SafeAreaProvider>
    ),
  ],
  parameters: {
    // This component uses its own i18n hook;
    // if your global preview already initializes i18n, you can remove this note.
    docs: {
      description: {
        component:
          'Click the circular trigger to open the popover. Items call `onNavigate` so you can see actions in the Storybook Actions panel.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof HeaderUserMenu>;

export const Default: Story = {
  args: {
    onNavigate: (path, opts) => action('onNavigate')({ path, opts }),
  },
};

export const TallToolbar: Story = {
  args: {
    toolbarHeight: 72,
    onNavigate: (path, opts) => action('onNavigate')({ path, opts }),
  },
};

export const WithoutNavigationHandler: Story = {
  args: {
    toolbarHeight: 56,
    // No onNavigate → menu still opens, items just won’t navigate.
  },
};
