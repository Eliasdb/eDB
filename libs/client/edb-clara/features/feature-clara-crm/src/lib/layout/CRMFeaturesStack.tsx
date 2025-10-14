import { Stack } from 'expo-router';
import { useCrmDir } from '../hooks/useCrmDir';

export function CRMFeaturesStack() {
  const dir = useCrmDir((s) => s.dir);
  const slide = dir === 'forward' ? 'slide_from_right' : 'slide_from_left';

  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* list pages */}
      <Stack.Screen name="dashboard/index" options={{ animation: slide }} />
      <Stack.Screen name="tasks/index" options={{ animation: slide }} />
      <Stack.Screen name="contacts/index" options={{ animation: slide }} />
      <Stack.Screen name="companies/index" options={{ animation: slide }} />

      {/* details as sheet; children under [id]/_layout inherit this presentation */}
      <Stack.Screen
        name="companies/[id]"
        options={{
          presentation: 'formSheet',
          animation: 'slide_from_bottom',
          sheetAllowedDetents: [0.4, 1],
          sheetGrabberVisible: true,
          sheetCornerRadius: 24,
          sheetExpandsWhenScrolledToEdge: true,
        }}
      />
    </Stack>
  );
}
