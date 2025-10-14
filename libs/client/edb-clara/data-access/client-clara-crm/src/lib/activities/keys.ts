// data-access/crm/activities/keys.ts
export const activityKeys = {
  all: ['activities'] as const,
  list: () => [...activityKeys.all, 'list'] as const,
  byId: (id: string) => [...activityKeys.all, 'byId', id] as const,
  byContact: (contactId: string) =>
    [...activityKeys.all, 'byContact', contactId] as const,
  // alias for legacy callers
  item: (id: string) => activityKeys.byId(id),
};
