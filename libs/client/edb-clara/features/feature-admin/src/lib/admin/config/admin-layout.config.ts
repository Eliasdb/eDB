// apps/mobile/src/app/(tabs)/admin/admin-layout.config.ts

/** Animations supported by Expo Router Stack */
export type Animation =
  | 'slide_from_right'
  | 'slide_from_left'
  | 'fade'
  | 'default';

/** Define tabs once; types
 * are derived from here */
const TABS = [
  {
    key: 'capabilities',
    label: 'Capabilities',
    segment: 'capabilities',
    animation: 'default',
  },
  { key: 'logs', label: 'Logs', segment: 'logs', animation: 'fade' },
] as const satisfies readonly {
  key: string;
  label: string;
  segment: string;
  animation?: Animation;
}[];

/** Literal union of tab keys: "capabilities" | "logs" */
export type AdminTabKey = (typeof TABS)[number]['key'];

export const ADMIN_LAYOUT_CONFIG = {
  sidebarTitle: 'Admin',
  sidebarFooter: 'Review tools and audit activity.',
  tabs: TABS,
} as const;

/* ----------------------------- helpers ----------------------------- */

export type NavDir = 'forward' | 'backward' | 'same';

const BASE = '/(tabs)/admin' as const;

/** Build a router path for a tab key */
export function pathForTab(key: AdminTabKey): string {
  const t = TABS.find((t) => t.key === key);
  return `${BASE}/${t?.segment ?? ''}`;
}

/** Infer tab key from current pathname */
export function tabFromPathname(pathname: string | null): AdminTabKey {
  const hit = TABS.find((t) => pathname?.startsWith(`${BASE}/${t.segment}`));
  return (hit ?? TABS[0]).key;
}

/** Direction based on tab order in TABS */
export function computeDir(prev: AdminTabKey, next: AdminTabKey): NavDir {
  const i1 = TABS.findIndex((t) => t.key === prev);
  const i2 = TABS.findIndex((t) => t.key === next);
  if (i1 < 0 || i2 < 0 || i1 === i2) return 'same';
  return i2 > i1 ? 'forward' : 'backward';
}

/** Default animation for a given tab */
export function defaultAnimationFor(key: AdminTabKey): Animation {
  return TABS.find((t) => t.key === key)?.animation ?? 'default';
}

export function slideFor(dir: NavDir): Animation {
  switch (dir) {
    case 'forward':
      return 'slide_from_right';
    case 'backward':
      return 'slide_from_left';
    default:
      return 'default';
  }
}

export function isDirectional(dir: NavDir): boolean {
  return dir === 'forward' || dir === 'backward';
}

/** Final decision maker for a given screen */
export function animationForScreen(
  dir: NavDir,
  current: AdminTabKey,
  key: AdminTabKey,
): Animation {
  if (key === current) return defaultAnimationFor(key);
  return isDirectional(dir) ? slideFor(dir) : 'default';
}
