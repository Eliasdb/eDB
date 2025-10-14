// data-access/crm/contacts/keys.ts
export const contactKeys = {
  all: ['contacts'] as const,
  list: () => [...contactKeys.all, 'list'] as const,
  byId: (id: string) => [...contactKeys.all, 'byId', id] as const,
  overview: (id: string) => [...contactKeys.all, 'overview', id] as const,
  activities: (id: string) => [...contactKeys.all, 'activities', id] as const,

  // optional alias for symmetry with legacy code
  item: (id: string) => contactKeys.byId(id),
};
