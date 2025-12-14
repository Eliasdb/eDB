// app/(support)/_layout.tsx
import { AppHeader } from '@edb/shared-ui-rn';
import { Stack, useRouter } from 'expo-router';

export default function SupportLayout() {
  const router = useRouter();

  return (
    <Stack
      screenOptions={{
        header: ({ options }) => (
          <AppHeader
            title={(options.title as string) ?? ''}
            onNavigate={(path, opts) =>
              opts?.replace ? router.replace(path) : router.push(path)
            }
          />
        ),
      }}
    >
      {/* Declare screens in this group so they get titles... */}
      <Stack.Screen name="help" options={{ title: 'Help & Support' }} />
    </Stack>
  );
}
