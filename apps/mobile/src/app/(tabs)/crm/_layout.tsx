// app/(tabs)/crm/_layout.tsx
import { ResponsiveTabsLayout } from '@ui/layout';
import { Slot, usePathname, useRouter } from 'expo-router';
import { Text } from 'react-native';

import {
  CRM_LAYOUT_CONFIG,
  CrmTabKey,
  getActiveCrmTab,
  pathForCrmTab,
} from '@features/crm/config/crm-layout.config';

import { useCrmDir } from '../../../lib/nav/crmDirection';

export default function CRMLayout() {
  const pathname = usePathname();
  const router = useRouter();
  const setNext = useCrmDir((s) => s.setNext);
  const dir = useCrmDir((s) => s.dir);

  const current = getActiveCrmTab(pathname);

  return (
    <ResponsiveTabsLayout<CrmTabKey>
      tabs={CRM_LAYOUT_CONFIG.tabs.map((t) => ({ key: t.key, label: t.label }))}
      value={current}
      onChange={(next) => {
        setNext(current, next);
        router.replace(pathForCrmTab(next));
      }}
      sidebarTitle={CRM_LAYOUT_CONFIG.sidebarTitle}
      sidebarFooter={
        <Text className="text-[12px] text-text-dim dark:text-text-dimDark">
          {CRM_LAYOUT_CONFIG.sidebarFooter}
        </Text>
      }
      tabIdPrefix="crm-tab-"
    >
      <Slot />
    </ResponsiveTabsLayout>
  );
}
