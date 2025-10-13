// app/(tabs)/admin/_layout.tsx
import { Stack, usePathname, useRouter } from 'expo-router';
import { useAdminDir } from '../../../../lib/nav/adminDirection';

import { ResponsiveTabsLayout } from '@ui/layout';
import { Text } from 'react-native';

import {
  ADMIN_LAYOUT_CONFIG,
  AdminTabKey,
  animationForScreen,
  NavDir,
  pathForTab,
  tabFromPathname,
} from '@features/admin/config/admin-layout.config';

export default function AdminShellLayout() {
  const pathname = usePathname();
  const router = useRouter();

  const setNext = useAdminDir((s) => s.setNext);
  const dir = useAdminDir((s) => s.dir) as NavDir; // optional cast

  const current: AdminTabKey = tabFromPathname(pathname);

  return (
    <ResponsiveTabsLayout<AdminTabKey>
      tabs={ADMIN_LAYOUT_CONFIG.tabs.map((t) => ({
        key: t.key,
        label: t.label,
      }))}
      value={current}
      onChange={(next) => {
        setNext(current, next);
        router.replace(pathForTab(next));
      }}
      sidebarTitle={ADMIN_LAYOUT_CONFIG.sidebarTitle}
      sidebarFooter={
        <Text className="text-[12px] text-text-dim dark:text-text-dimDark">
          {ADMIN_LAYOUT_CONFIG.sidebarFooter}
        </Text>
      }
    >
      <Stack screenOptions={{ headerShown: false }}>
        {ADMIN_LAYOUT_CONFIG.tabs.map((t) => (
          <Stack.Screen
            key={t.key}
            name={t.key}
            options={{ animation: animationForScreen(dir, current, t.key) }}
          />
        ))}
      </Stack>
    </ResponsiveTabsLayout>
  );
}
