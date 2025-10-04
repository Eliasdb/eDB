import { ResponsiveTabsLayout } from '@ui/layout';
import { Slot, usePathname, useRouter } from 'expo-router';
import { Text } from 'react-native';

type Tab = 'capabilities' | 'logs';

export default function AdminShellLayout() {
  const pathname = usePathname();
  const router = useRouter();
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
      onChange={(k) => router.replace(`/(tabs)/admin/${k}`)}
      sidebarTitle="Admin"
      sidebarFooter={
        <Text className="text-[12px] text-text-dim dark:text-text-dimDark">
          Review tools and audit activity.
        </Text>
      }
    >
      <Slot />
    </ResponsiveTabsLayout>
  );
}
