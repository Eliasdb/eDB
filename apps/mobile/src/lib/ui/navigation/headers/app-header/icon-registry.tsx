// Central place to pick the header icon (Ionicons name) per section.
// Add more keys as your app grows.

export const headerIconRegistry = {
  chat: 'chatbubble-ellipses-outline',
  crm: 'checkmark-done-outline',
  clara: 'sparkles-outline',
  profile: 'person-circle-outline',
  admin: 'terminal-outline',
  help: 'help-buoy-outline',
  settings: 'options-outline',
} as const;

export type HeaderIconKey = keyof typeof headerIconRegistry;
export type IoniconName = (typeof headerIconRegistry)[HeaderIconKey];
