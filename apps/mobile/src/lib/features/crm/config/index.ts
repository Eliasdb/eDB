// features/crm/navigation.ts
export type CrmTabKey = 'dashboard' | 'tasks' | 'contacts' | 'companies';

export const tabToPath: Record<CrmTabKey, string> = {
  dashboard: '/(tabs)/crm/dashboard',
  tasks: '/(tabs)/crm/tasks',
  contacts: '/(tabs)/crm/contacts',
  companies: '/(tabs)/crm/companies',
};

// Pure function (testable): path -> active tab
export function getActiveCrmTab(pathname: string): CrmTabKey {
  if (pathname.endsWith('/tasks')) return 'tasks';
  if (pathname.endsWith('/contacts')) return 'contacts';
  if (pathname.endsWith('/companies')) return 'companies';
  return 'dashboard';
}

// features/crm/tabs-config.ts
import type { TFunction } from 'i18next';

export type CrmTab = { key: CrmTabKey; label: string };

export function buildCrmTabs(t: TFunction): CrmTab[] {
  return [
    {
      key: 'dashboard',
      label: t('crm.dashboard', { defaultValue: 'Dashboard' }),
    },
    { key: 'tasks', label: t('crm.tasks', { defaultValue: 'Tasks' }) },
    { key: 'contacts', label: t('crm.contacts', { defaultValue: 'Contacts' }) },
    {
      key: 'companies',
      label: t('crm.companies', { defaultValue: 'Companies' }),
    },
  ];
}
