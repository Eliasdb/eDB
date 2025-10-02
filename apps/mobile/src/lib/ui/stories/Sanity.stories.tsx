// apps/mobile/src/stories/Sanity.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { Text, View } from 'react-native';

export default { title: 'Sanity/Hello' } satisfies Meta;

export const Basic: StoryObj = {
  render: () => (
    <View style={{ padding: 16, backgroundColor: '#eee' }}>
      <Text>Hello from RNW 👋</Text>
    </View>
  ),
};
