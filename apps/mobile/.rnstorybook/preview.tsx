// apps/mobile/.rnstorybook/preview.tsx
import { withBackgrounds } from '@storybook/addon-ondevice-backgrounds';
import type { Preview } from '@storybook/react';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useThemeOverride } from '../src/lib/ui/widgets/theme-picker/uset';

const styles = StyleSheet.create({
  container: { flex: 1 },
});

// Stable component (not recreated per render)
function ThemedWrapper({
  picked,
  children,
}: {
  picked?: string;
  children: React.ReactNode;
}) {
  // 🚫 do not restore from storage inside SB to avoid flicker
  const { effective } = useThemeOverride({ restore: false });
  const bg = picked ?? (effective === 'dark' ? '#0b0c0f' : 'white');
  return (
    <View style={[styles.container, { backgroundColor: bg }]}>{children}</View>
  );
}

const preview: Preview = {
  decorators: [
    withBackgrounds,
    (Story, context) => {
      const picked = context?.globals?.backgrounds?.value as string | undefined;
      return (
        <ThemedWrapper picked={picked}>
          <Story />
        </ThemedWrapper>
      );
    },
  ],
  parameters: {
    backgrounds: {
      default: 'plain',
      values: [
        { name: 'plain', value: 'white' },
        { name: 'dark', value: '#0b0c0f' },
      ],
    },
  },
};

export default preview;
