export const hubKeys = {
  all: ['hub'] as const,
  tasks: () => [...hubKeys.all, 'tasks'] as const,
  contacts: () => [...hubKeys.all, 'contacts'] as const,
  companies: () => [...hubKeys.all, 'companies'] as const,
  activities: (contactId?: string) =>
    ['activities', contactId ?? 'all'] as const, // 👈
};

// core/keys.ts
export const toolLogKeys = {
  all: ['tool-logs'] as const,
  list: (limit: number) => [...toolLogKeys.all, 'list', limit] as const,
  head: (limit: number) => [...toolLogKeys.all, 'head', limit] as const,
};
