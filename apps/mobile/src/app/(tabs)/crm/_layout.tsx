// apps/mobile/src/app/(tabs)/crm/_layout.tsx
import { Stack } from 'expo-router';

export default function CRMLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        presentation: 'card',
        animation: 'slide_from_right',      // default for this stack
        gestureEnabled: true,
        fullScreenGestureEnabled: true,
        contentStyle: { backgroundColor: 'transparent' },
      }}
    >
      {/* keep index (overviews) snappy/no animation */}
      <Stack.Screen name="(features)/companies/index" options={{ animation: 'none' }} />
      <Stack.Screen name="(features)/contacts/index" options={{ animation: 'none' }} />

      {/* details inherit slide_from_right */}
      <Stack.Screen name="(features)/companies/[id]" />
      <Stack.Screen name="(features)/contacts/[id]" />
    </Stack>
  );
}
