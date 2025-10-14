// Centralize tabs, routing helpers, and close behavior.

import { router } from 'expo-router';
import { Platform } from 'react-native';

export type TabKey = 'snapshot' | 'research' | 'work' | 'tasks' | 'overview';

type TabDef = {
  value: TabKey;
  label: string;
  iconName:
    | 'grid-outline'
    | 'document-text-outline'
    | 'people-outline'
    | 'checkmark-done-outline'
    | 'list-outline';
};

export const COMPANY_DETAIL_TABS: readonly TabDef[] = [
  { value: 'snapshot', label: 'Snapshot', iconName: 'grid-outline' },
  { value: 'research', label: 'Research', iconName: 'document-text-outline' },
  { value: 'work', label: 'Contacts', iconName: 'people-outline' },
  { value: 'tasks', label: 'Tasks', iconName: 'checkmark-done-outline' },
  { value: 'overview', label: 'Activity', iconName: 'list-outline' },
] as const;

export const COMPANIES_BASE = '/(tabs)/crm/(features)/companies' as const;
export const COMPANY_DETAIL_BASE =
  '/(tabs)/crm/(features)/companies/[id]' as const;

export function pathForCompanyTab(id: string, tab: TabKey) {
  return `${COMPANY_DETAIL_BASE}/${tab}?id=${encodeURIComponent(id)}`;
}

export function listPath() {
  return COMPANIES_BASE;
}

export function activeTabFromPathname(pathname: string | null): TabKey {
  if (!pathname) return 'snapshot';
  // expected: /.../companies/[id]/<tab>
  const seg = pathname.split('/').pop() as TabKey | undefined;
  return (COMPANY_DETAIL_TABS.find((t) => t.value === seg)?.value ??
    'snapshot') as TabKey;
}

/** Close the sheet/page in a platform-safe way */
export function closeToList() {
  if (Platform.OS === 'web') {
    // Avoid history weirdness after refresh/deep links
    router.replace(listPath());
    return;
  }
  if (router.canGoBack()) {
    // native sheet gets a proper slide-down animation
    router.back();
  } else {
    router.replace(listPath());
  }
}
