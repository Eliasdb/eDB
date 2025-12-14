// apps/mobile/src/lib/ui/sheet.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { Sheet } from './sheet';

const meta: Meta<typeof Sheet> = {
  title: 'Primitives/Overlays/Sheet',
  component: Sheet,
  args: {
    // only serializable defaults go here
    maxHeightPct: 0.85,
    radius: 16,
    disableBackdropClose: false,
  },
  decorators: [
    (Story) => (
      <View style={{ padding: 16, flex: 1 }}>
        <Story />
      </View>
    ),
  ],
};
export default meta;

type Story = StoryObj<typeof Sheet>;

const BasicRender = (args: Parameters<typeof Sheet>[0]) => {
  const [open, setOpen] = useState(false);
  return (
    <View style={{ gap: 12 }}>
      <Pressable
        onPress={() => setOpen(true)}
        style={{ padding: 12, backgroundColor: '#111827', borderRadius: 10 }}
      >
        <Text style={{ color: 'white', fontWeight: '600' }}>Open sheet</Text>
      </Pressable>

      <Sheet {...args} visible={open} onClose={() => setOpen(false)}>
        <Text style={{ fontSize: 18, fontWeight: '700', marginBottom: 8 }}>
          Hello from the Sheet
        </Text>
        <Text style={{ color: '#6B7280', marginBottom: 12 }}>
          Tap the backdrop or press the button below to close.
        </Text>
        <Pressable
          onPress={() => setOpen(false)}
          style={{
            padding: 12,
            backgroundColor: '#6C63FF',
            borderRadius: 10,
          }}
        >
          <Text style={{ color: 'white', textAlign: 'center' }}>Close</Text>
        </Pressable>
      </Sheet>
    </View>
  );
};

/** Basic open/close with a button */
export const Basic: Story = {
  render: (args) => <BasicRender {...args} />,
};

const TallContentRender = (args: Parameters<typeof Sheet>[0]) => {
  const [open, setOpen] = useState(true);
  return (
    <Sheet {...args} visible={open} onClose={() => setOpen(false)}>
      <Text style={{ fontSize: 18, fontWeight: '700', marginBottom: 8 }}>
        Notifications
      </Text>
      <ScrollView style={{ maxHeight: 400 }}>
        {Array.from({ length: 30 }).map((_, i) => (
          <View
            key={i}
            style={{
              paddingVertical: 10,
              borderBottomWidth: 1,
              borderBottomColor: 'rgba(0,0,0,0.06)',
            }}
          >
            <Text>Item #{i + 1} — some content goes here.</Text>
          </View>
        ))}
      </ScrollView>
      <View style={{ height: 8 }} />
      <Pressable
        onPress={() => setOpen(false)}
        style={{
          padding: 12,
          backgroundColor: '#111827',
          borderRadius: 10,
        }}
      >
        <Text style={{ color: 'white', textAlign: 'center' }}>Close</Text>
      </Pressable>
    </Sheet>
  );
};

/** Long/tall content with scroll */
export const TallContent: Story = {
  args: { maxHeightPct: 0.9 },
  render: (args) => <TallContentRender {...args} />,
};

const WithFormRender = (args: Parameters<typeof Sheet>[0]) => {
  const [open, setOpen] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  return (
    <Sheet {...args} visible={open} onClose={() => setOpen(false)}>
      <Text style={{ fontSize: 18, fontWeight: '700', marginBottom: 8 }}>
        Quick form
      </Text>
      <View style={{ gap: 10 }}>
        <TextInput
          placeholder="Name"
          value={name}
          onChangeText={setName}
          style={{
            borderWidth: 1,
            borderColor: 'rgba(0,0,0,0.1)',
            padding: 10,
            borderRadius: 10,
          }}
          placeholderTextColor="#98a2b3"
        />
        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          style={{
            borderWidth: 1,
            borderColor: 'rgba(0,0,0,0.1)',
            padding: 10,
            borderRadius: 10,
          }}
          placeholderTextColor="#98a2b3"
        />
        <Pressable
          onPress={() => setOpen(false)}
          style={{
            padding: 12,
            backgroundColor: '#6C63FF',
            borderRadius: 10,
            marginTop: 6,
          }}
        >
          <Text style={{ color: 'white', textAlign: 'center' }}>
            Save & Close
          </Text>
        </Pressable>
      </View>
    </Sheet>
  );
};

/** Form demo to show KeyboardAvoidingView behavior */
export const WithForm: Story = {
  render: (args) => <WithFormRender {...args} />,
};

const NoBackdropCloseRender = (args: Parameters<typeof Sheet>[0]) => {
  const [open, setOpen] = useState(true);
  return (
    <Sheet {...args} visible={open} onClose={() => setOpen(false)}>
      <Text style={{ fontSize: 18, fontWeight: '700', marginBottom: 8 }}>
        Backdrop disabled
      </Text>
      <Text style={{ color: '#6B7280', marginBottom: 12 }}>
        Tap the button below to close.
      </Text>
      <Pressable
        onPress={() => setOpen(false)}
        style={{ padding: 12, backgroundColor: '#ef4444', borderRadius: 10 }}
      >
        <Text style={{ color: 'white', textAlign: 'center' }}>Close</Text>
      </Pressable>
    </Sheet>
  );
};

/** Backdrop disabled — must close via an explicit action */
export const NoBackdropClose: Story = {
  args: { disableBackdropClose: true },
  render: (args) => <NoBackdropCloseRender {...args} />,
};

const CompactRoundedRender = (args: Parameters<typeof Sheet>[0]) => {
  const [open, setOpen] = useState(true);
  return (
    <Sheet {...args} visible={open} onClose={() => setOpen(false)}>
      <Text style={{ fontSize: 18, fontWeight: '700', marginBottom: 8 }}>
        Compact & Rounded
      </Text>
      <Text style={{ color: '#6B7280' }}>
        Handy for quick pickers or action sheets.
      </Text>
    </Sheet>
  );
};

/** Custom radius/height quick visual */
export const CompactRounded: Story = {
  args: { radius: 28, maxHeightPct: 0.6 },
  render: (args) => <CompactRoundedRender {...args} />,
};
