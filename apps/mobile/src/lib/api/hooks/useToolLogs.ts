// hooks/useToolLogsInfinite.ts
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { fetchToolLogsPage } from '../services/toolLogs';

export function useToolLogsInfinite(limit = 10) {
  return useInfiniteQuery({
    queryKey: ['tool-logs', limit],
    queryFn: ({ pageParam = 0 }) => fetchToolLogsPage({ pageParam, limit }),
    initialPageParam: 0,
    getNextPageParam: (last) => (last.hasMore ? last.nextOffset! : undefined),
    staleTime: 1_000,
    refetchOnWindowFocus: false, // we’ll control head polling separately
  });
}

export function useToolLogsHead(limit = 10) {
  return useQuery({
    queryKey: ['tool-logs', 'head', limit],
    queryFn: () => fetchToolLogsPage({ pageParam: 0, limit }),
    refetchInterval: 3000,
    staleTime: 1_000,
  });
}
