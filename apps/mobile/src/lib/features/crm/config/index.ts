// features/crm/navigation.ts
export type CrmTabKey = 'dashboard' | 'tasks' | 'contacts' | 'companies';

export const tabToPath: Record<CrmTabKey, string> = {
  dashboard: '/(tabs)/crm/dashboard',
  tasks: '/(tabs)/crm/tasks',
  contacts: '/(tabs)/crm/contacts',
  companies: '/(tabs)/crm/companies',
};

// Normalize: remove trailing slashes and group segments like /(tabs) /(features)
function normalize(pathname: string) {
  const p = (pathname || '').replace(/\/+$/, '');
  return p.replace(/\/\([^/]+\)/g, '').toLowerCase();
}

// Pure function (testable): path -> active tab
export function getActiveCrmTab(pathname: string): CrmTabKey {
  const p = normalize(pathname);

  // Match deep paths first so detail pages stay on the correct tab
  if (p.includes('/crm/companies')) return 'companies';
  if (p.includes('/crm/contacts')) return 'contacts';
  if (p.includes('/crm/tasks')) return 'tasks';

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
