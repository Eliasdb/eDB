// Tool logs

import { useQuery } from '@tanstack/react-query';
import { API_BASE } from '../../../../lib/api/client';
import type { ToolLogsPayload } from '../../../../lib/api/types';

export const toolLogKeys = {
  all: ['toolLogs'] as const,
};

export function useToolLogs() {
  return useQuery({
    queryKey: toolLogKeys.all,
    queryFn: async () => {
      const r = await fetch(`${API_BASE}/realtime/tool-logs`);
      if (!r.ok) throw new Error('Failed to fetch tool logs');
      const json = (await r.json()) as ToolLogsPayload;
      return json.items;
    },
    // keep it feeling “live”
    refetchInterval: 3000,
    refetchOnWindowFocus: true,
    staleTime: 1000,
  });
}
