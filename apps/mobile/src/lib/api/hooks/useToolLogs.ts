import { useQuery } from '@tanstack/react-query';
import { toolLogKeys } from '../core/keys';
import { fetchToolLogs } from '../services/toolLogs';

export function useToolLogs() {
  return useQuery({
    queryKey: toolLogKeys.all,
    queryFn: fetchToolLogs,
    // keep it feeling “live”
    refetchInterval: 3000,
    refetchOnWindowFocus: true,
    staleTime: 1000,
  });
}
