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
