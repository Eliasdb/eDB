export const toolLogKeys = {
  all: ['tool-logs'] as const,
  list: (limit: number) => [...toolLogKeys.all, 'list', limit] as const,
  head: (limit: number) => [...toolLogKeys.all, 'head', limit] as const,
};
