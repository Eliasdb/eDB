// api/crm/companies/keys.ts
// data-access/crm/companies/keys.ts
export const companyKeys = {
  all: ['companies'] as const,
  list: () => [...companyKeys.all, 'list'] as const,
  byId: (id: string) => [...companyKeys.all, 'byId', id] as const,
  overview: (id: string) => [...companyKeys.all, 'overview', id] as const,

  // ✅ alias so existing code (cache.ts) compiles
  item: (id: string) => companyKeys.byId(id),
};
