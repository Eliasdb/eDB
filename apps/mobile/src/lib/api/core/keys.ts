export const hubKeys = {
  all: ['hub'] as const,
  tasks: () => [...hubKeys.all, 'tasks'] as const,
  contacts: () => [...hubKeys.all, 'contacts'] as const,
  companies: () => [...hubKeys.all, 'companies'] as const,
};

export const toolLogKeys = {
  all: ['toolLogs'] as const,
};
