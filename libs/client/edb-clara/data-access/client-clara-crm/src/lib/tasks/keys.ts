// data-access/crm/tasks/keys.ts
export const taskKeys = {
  all: ['tasks'] as const,
  list: () => [...taskKeys.all, 'list'] as const,
  byId: (id: string) => [...taskKeys.all, 'byId', id] as const,
  // alias for legacy callers
  item: (id: string) => taskKeys.byId(id),
};
