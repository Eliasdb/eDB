import { ResponsiveTabsLayout } from '@edb/shared-ui-rn';
import { Stack, usePathname, useRouter } from 'expo-router';
import { useEffect } from 'react';
import { Text } from 'react-native';
import {
  ADMIN_LAYOUT_CONFIG,
  AdminTabKey,
  animationForScreen,
  NavDir,
  pathForTab,
  tabFromPathname,
} from './config/admin-layout.config';

// NOTE: keep the hook in your app/store; import from your existing path
import { useAdminDir } from '../lib/hooks/useAdminDir';

export default function AdminShellLayout() {
  const pathname = usePathname();
  const router = useRouter();

  const setNext = useAdminDir((s) => s.setNext);
  const dir = useAdminDir((s) => s.dir) as NavDir;

  const current: AdminTabKey = tabFromPathname(pathname);

  // ---- Debug logs ----
  useEffect(() => {
    // fires whenever the URL changes
    console.log('[Admin] path change:', { pathname, current, dir });
  }, [pathname, current, dir]);

  return (
    <ResponsiveTabsLayout<AdminTabKey>
      tabs={ADMIN_LAYOUT_CONFIG.tabs.map((t) => ({
        key: t.key,
        label: t.label,
      }))}
      value={current}
      onChange={(next) => {
        console.log('[Admin] onChange ->', { from: current, to: next, dir });
        setNext(current, next);
        const target = pathForTab(next);
        console.log('[Admin] navigate replace:', target);
        router.replace(target);
      }}
      sidebarTitle={ADMIN_LAYOUT_CONFIG.sidebarTitle}
      sidebarFooter={
        <Text /* if using RN Text, avoid className unless NativeWind types installed */
          style={{ fontSize: 12, color: '#667085' }}
        >
          {ADMIN_LAYOUT_CONFIG.sidebarFooter}
        </Text>
      }
    >
      <Stack screenOptions={{ headerShown: false }}>
        {ADMIN_LAYOUT_CONFIG.tabs.map((t) => {
          const anim = animationForScreen(dir, current, t.key);
          console.log('[Admin] screen options:', {
            screen: t.key,
            anim,
            current,
            dir,
          });
          return (
            <Stack.Screen
              key={t.key}
              name={t.key}
              options={{ animation: anim }}
            />
          );
        })}
      </Stack>
    </ResponsiveTabsLayout>
  );
}
