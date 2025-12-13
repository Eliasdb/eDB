// crm-layout.config.ts
export type CrmTabKey = 'dashboard' | 'tasks' | 'contacts' | 'companies';

const TABS = [
  { key: 'dashboard', label: 'Dashboard', segment: 'dashboard' },
  { key: 'tasks', label: 'Tasks', segment: 'tasks' },
  { key: 'contacts', label: 'Contacts', segment: 'contacts' },
  { key: 'companies', label: 'Companies', segment: 'companies' },
] as const;

export const CRM_LAYOUT_CONFIG = {
  sidebarTitle: 'CRM',
  sidebarFooter: 'Manage tasks, contacts and companies.',
  tabs: TABS,
} as const;

const BASE = '/(tabs)/crm';

export function pathForCrmTab(key: CrmTabKey) {
  const tab = TABS.find((t) => t.key === key);
  return tab ? `${BASE}/${tab.segment}` : BASE;
}

export function getActiveCrmTab(pathname: string | null): CrmTabKey {
  const match = TABS.find((t) => pathname?.includes(t.segment));
  return match?.key ?? 'dashboard';
}
