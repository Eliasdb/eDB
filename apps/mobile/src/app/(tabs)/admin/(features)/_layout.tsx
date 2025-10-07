import { ResponsiveTabsLayout } from '@ui/layout';
import { Stack, usePathname, useRouter } from 'expo-router';
import { Text } from 'react-native';
import { useAdminDir } from '../../../../lib/nav/adminDirection';

type Tab = 'capabilities' | 'logs';

export default function AdminShellLayout() {
  const pathname = usePathname();
  const router = useRouter();
  const setNext = useAdminDir((s) => s.setNext);
  const dir = useAdminDir((s) => s.dir);
  const slide = dir === 'forward' ? 'slide_from_right' : 'slide_from_left';

  const current: Tab = pathname?.includes('/admin/logs')
    ? 'logs'
    : 'capabilities';

  return (
    <ResponsiveTabsLayout<Tab>
      tabs={[
        { key: 'capabilities', label: 'Capabilities' },
        { key: 'logs', label: 'Logs' },
      ]}
      value={current}
      onChange={(next) => {
        setNext(current, next); // set direction for animation
        router.push(`/(tabs)/admin/${next}`); // push so Stack animates
      }}
      sidebarTitle="Admin"
      sidebarFooter={
        <Text className="text-[12px] text-text-dim dark:text-text-dimDark">
          Review tools and audit activity.
        </Text>
      }
    >
      {/* 🔽 Put the Stack here, and reference files by simple names */}
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="capabilities" options={{ animation: slide }} />
        <Stack.Screen name="logs" options={{ animation: 'fade' }} />
        {/* or also direction-aware: options={{ animation: slide }} */}
      </Stack>
      {/* <Slot/> is NOT needed when you mount a Stack here */}
    </ResponsiveTabsLayout>
  );
}
