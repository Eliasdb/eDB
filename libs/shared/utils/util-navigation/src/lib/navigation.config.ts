export interface NavigationLink {
  id: string;
  label: string;
  icon?: string; // FontAwesome icon
}

export const WEB_NAVIGATION_LINKS: NavigationLink[] = [
  { id: '', label: 'My eDB', icon: 'faCompass' },
  { id: 'catalog', label: 'Catalog', icon: 'faBoxesStacked' },
  { id: 'account', label: 'Account', icon: 'faIdBadge' },
];
