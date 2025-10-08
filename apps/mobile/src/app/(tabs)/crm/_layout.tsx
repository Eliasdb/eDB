// app/(tabs)/crm/_layout.tsx
import { ResponsiveTabsLayout } from '@ui/layout';
import { Slot, usePathname, useRouter } from 'expo-router';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Text } from 'react-native';

import { buildCrmTabs, getActiveCrmTab, tabToPath } from '@features/crm/config';
import { useCrmDir } from '../../../lib/nav/crmDirection'; // 👈 import store

export default function CRMLayout() {
  const { t } = useTranslation();
  const router = useRouter();
  const pathname = usePathname();
  const setNext = useCrmDir((s) => s.setNext);

  const active = useMemo(() => getActiveCrmTab(pathname), [pathname]);
  const tabs = useMemo(() => buildCrmTabs(t), [t]);

  return (
    <ResponsiveTabsLayout
      tabs={tabs}
      value={active}
      onChange={(next) => {
        setNext(active, next); // 👈 store direction
        router.replace(tabToPath[next]); // push, not replace, for animation
      }}
      sidebarTitle={t('crm.title', { defaultValue: 'CRM' })}
      sidebarFooter={
        <Text className="text-[12px] text-text-dim dark:text-text-dimDark">
          {t('crm.sidebar.footer', {
            defaultValue: 'Manage tasks, contacts, and companies.',
          })}
        </Text>
      }
      tabIdPrefix="crm-tab-"
    >
      <Slot />
    </ResponsiveTabsLayout>
  );
}
