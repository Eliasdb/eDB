// Hooks
import { Slot, usePathname, useRouter } from 'expo-router';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

// UI
import { ResponsiveTabsLayout } from '@ui/layout';
import { Text, View } from 'react-native';

type TabKey = 'dashboard' | 'tasks' | 'contacts' | 'companies';

const tabToPath: Record<TabKey, string> = {
  dashboard: '/(tabs)/crm/dashboard',
  tasks: '/(tabs)/crm/tasks',
  contacts: '/(tabs)/crm/contacts',
  companies: '/(tabs)/crm/companies',
};

function useActiveTab(): TabKey {
  const p = usePathname();
  if (p.endsWith('/tasks')) return 'tasks';
  if (p.endsWith('/contacts')) return 'contacts';
  if (p.endsWith('/companies')) return 'companies';
  return 'dashboard';
}

export default function CRMLayout() {
  const { t } = useTranslation();
  const router = useRouter();
  const active = useActiveTab();

  const tabs = useMemo(
    () => [
      { key: 'dashboard', label: 'Dashboard' },
      { key: 'tasks', label: t('crm.tasks', { defaultValue: 'Tasks' }) },
      {
        key: 'contacts',
        label: t('crm.contacts', { defaultValue: 'Contacts' }),
      },
      {
        key: 'companies',
        label: t('crm.companies', { defaultValue: 'Companies' }),
      },
    ],
    [t],
  ) as { key: TabKey; label: string }[];

  return (
    <View className="flex-1 bg-surface dark:bg-surface-dark">
      <ResponsiveTabsLayout<TabKey>
        tabs={tabs}
        value={active}
        onChange={(k) => router.replace(tabToPath[k])}
        sidebarTitle="CRM"
        sidebarFooter={
          <Text className="text-[12px] text-text-dim dark:text-text-dimDark">
            Manage tasks, contacts, and companies.
          </Text>
        }
      >
        <Slot />
      </ResponsiveTabsLayout>
    </View>
  );
}
