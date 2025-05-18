import { environment } from '@eDB/shared-env';

export const MENU_OPTIONS = [
  { id: '', label: 'My eDB' },
  { id: 'catalog', label: 'Catalog' },
  {
    id: 'profile',
    label: 'Profile',
    external: true,
    url: environment.KC.account, // full Keycloak URL
  },
  { id: 'logout', label: 'Logout' },
];
