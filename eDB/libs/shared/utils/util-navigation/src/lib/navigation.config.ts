export interface NavigationLink {
  id: string;
  label: string;
}

export const WEB_NAVIGATION_LINKS: NavigationLink[] = [
  { id: '', label: 'My eDB' },
  { id: 'catalog', label: 'Catalog' },
  { id: 'account', label: 'Account' },
];
