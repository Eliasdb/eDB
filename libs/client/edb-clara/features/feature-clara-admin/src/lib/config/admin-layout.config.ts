/** Animations supported by Expo Router Stack */
export type Animation =
  | 'slide_from_right'
  | 'slide_from_left'
  | 'fade'
  | 'default';

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

export type AdminTabKey = (typeof TABS)[number]['key'];

export const ADMIN_LAYOUT_CONFIG = {
  sidebarTitle: 'Admin',
  sidebarFooter: 'Review tools and audit activity.',
  tabs: TABS,
} as const;

/* ----------------------------- helpers ----------------------------- */

export type NavDir = 'forward' | 'backward' | 'same';

// Keep BASE with route-groups for navigation (router.replace works with it)
const BASE = '/(tabs)/admin/(features)' as const;

/** Build a router path for a tab key (uses route groups) */
export function pathForTab(key: AdminTabKey): string {
  const seg = TABS.find((t) => t.key === key)?.segment ?? 'capabilities';
  return `${BASE}/${seg}`;
}

/** Robust active-tab detection from pathname (works with/without route groups) */
export function tabFromPathname(pathname: string | null): AdminTabKey {
  if (!pathname) return 'capabilities';

  // strip query/hash and trailing slashes
  const clean = pathname.split(/[?#]/)[0].replace(/\/+$/, '');

  // split and remove empty bits
  const parts = clean.split('/').filter(Boolean); // e.g. ["admin", "logs"]

  // Make sure we're in the admin stack at all
  if (!parts.includes('admin')) return 'capabilities';

  // Last segment should be the tab segment
  const last = parts[parts.length - 1];
  const hit = TABS.find((t) => t.segment === last)?.key as
    | AdminTabKey
    | undefined;

  // If we navigated to '/admin' (index), default to capabilities
  return hit ?? 'capabilities';
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
