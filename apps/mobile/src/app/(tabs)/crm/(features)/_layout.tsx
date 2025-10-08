// app/(tabs)/crm/(features)/_layout.tsx
import { Stack } from 'expo-router';
import { useCrmDir } from '../../../../lib/nav/crmDirection';

export default function CRMFeaturesStack() {
  const dir = useCrmDir((s) => s.dir);
  const slide = dir === 'forward' ? 'slide_from_right' : 'slide_from_left';

  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* List pages */}
      <Stack.Screen name="dashboard/index" options={{ animation: slide }} />
      <Stack.Screen name="tasks/index" options={{ animation: slide }} />
      <Stack.Screen name="contacts/index" options={{ animation: slide }} />
      <Stack.Screen name="companies/index" options={{ animation: slide }} />

      {/* Details (formSheet) */}
      <Stack.Screen
        name="contacts/[id]"
        options={{
          presentation: 'formSheet',
          animation: 'slide_from_bottom',
          sheetAllowedDetents: [0.5, 1],
          sheetGrabberVisible: true,
          sheetCornerRadius: 24,
          sheetExpandsWhenScrolledToEdge: false,
        }}
      />
      <Stack.Screen
        name="companies/[id]"
        options={{
          presentation: 'formSheet',
          animation: 'slide_from_bottom',
          sheetAllowedDetents: [0.4, 1],
          sheetGrabberVisible: true,
          sheetCornerRadius: 24,
          sheetExpandsWhenScrolledToEdge: false,
        }}
      />
      <Stack.Screen
        name="tasks/[id]"
        options={{
          presentation: 'formSheet',
          animation: 'slide_from_bottom',
          sheetAllowedDetents: [0.5, 1],
          sheetGrabberVisible: true,
          sheetCornerRadius: 24,
          sheetExpandsWhenScrolledToEdge: false,
        }}
      />
    </Stack>
  );
}
