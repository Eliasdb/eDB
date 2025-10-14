// apps/mobile/src/lib/ui/primitives/divider.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { Text, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Divider } from './divider';

const meta: Meta<typeof Divider> = {
  title: 'Primitives/Display/Divider',
  component: Divider,
  decorators: [
    (Story) => (
      <SafeAreaProvider>
        <View style={{ flex: 1, backgroundColor: '#f6f7fb', padding: 16 }}>
          <Story />
        </View>
      </SafeAreaProvider>
    ),
  ],
};
export default meta;

type Story = StoryObj<typeof Divider>;

export const Basic: Story = {
  render: () => (
    <View>
      <Text style={{ paddingVertical: 8 }}>Above</Text>
      <Divider />
      <Text style={{ paddingVertical: 8 }}>Below</Text>
    </View>
  ),
};

export const InList: Story = {
  render: () => (
    <View>
      <Text style={{ paddingVertical: 8 }}>First</Text>
      <Divider />
      <Text style={{ paddingVertical: 8 }}>Second</Text>
      <Divider />
      <Text style={{ paddingVertical: 8 }}>Third</Text>
    </View>
  ),
};

export const OnDarkBackground: Story = {
  render: () => (
    <View style={{ backgroundColor: '#0b0c0f', padding: 16, borderRadius: 12 }}>
      <Text style={{ color: 'white', paddingVertical: 8 }}>Alpha</Text>
      <Divider />
      <Text style={{ color: 'white', paddingVertical: 8 }}>Beta</Text>
      <Divider />
      <Text style={{ color: 'white', paddingVertical: 8 }}>Gamma</Text>
    </View>
  ),
};
