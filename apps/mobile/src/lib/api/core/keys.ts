export const hubKeys = {
  all: ['hub'] as const,
  tasks: () => [...hubKeys.all, 'tasks'] as const,
  contacts: () => [...hubKeys.all, 'contacts'] as const,
  companies: () => [...hubKeys.all, 'companies'] as const,
  activities: (contactId?: string) =>
    ['hub', 'activities', contactId ?? 'all'] as const,
  companyOverview: (companyId: string) =>
    ['hub', 'company-overview', companyId] as const,
  contact: ['hub', 'contact'] as const,
};

// core/keys.ts
export const toolLogKeys = {
  all: ['tool-logs'] as const,
  list: (limit: number) => [...toolLogKeys.all, 'list', limit] as const,
  head: (limit: number) => [...toolLogKeys.all, 'head', limit] as const,
};

// api/core/keys.ts
export const companyKeys = {
  all: ['companies'] as const,
  list: () => [...companyKeys.all, 'list'] as const,
  item: (id: string) => [...companyKeys.all, 'item', id] as const,
  overview: (id: string) => [...companyKeys.all, 'overview', id] as const,
};

export const contactKeys = {
  all: ['contacts'] as const,
  list: () => [...contactKeys.all, 'list'] as const,
  item: (id: string) => [...contactKeys.all, 'item', id] as const,
  activities: (id: string) => [...contactKeys.all, 'activities', id] as const,
};

export const taskKeys = {
  all: ['tasks'] as const,
  list: () => [...taskKeys.all, 'list'] as const,
  item: (id: string) => [...taskKeys.all, 'item', id] as const,
};

export const activityKeys = {
  all: ['activities'] as const,
  list: () => [...activityKeys.all, 'list'] as const,
  item: (id: string) => [...activityKeys.all, 'item', id] as const,
  byContact: (contactId: string) =>
    [...activityKeys.all, 'byContact', contactId] as const,
};
