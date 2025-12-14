import { ResponsiveTabsLayout } from '@edb/shared-ui-rn';
import { Slot, usePathname, useRouter } from 'expo-router';
import { Text } from 'react-native';

import {
  CRM_LAYOUT_CONFIG,
  CrmTabKey,
  getActiveCrmTab,
  pathForCrmTab,
} from '../config/crm-layout.config';

import { useCrmDir } from '../hooks/useCrmDir';

export function CRMShellLayout() {
  const pathname = usePathname();
  const router = useRouter();

  const setNext = useCrmDir((s) => s.setNext);
  const current = getActiveCrmTab(pathname);

  return (
    <ResponsiveTabsLayout
      tabs={CRM_LAYOUT_CONFIG.tabs.map((t) => ({ key: t.key, label: t.label }))}
      value={current}
      onChange={(next) => {
        const tab = next as CrmTabKey;
        setNext(current, tab);
        router.replace(pathForCrmTab(tab));
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
