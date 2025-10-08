// hooks/useToolLogsInfinite.ts
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { toolLogKeys } from '../core/keys';
import { fetchToolLogsPage } from '../services/toolLogs';

export function useToolLogsInfinite(limit = 10) {
  return useInfiniteQuery({
    queryKey: toolLogKeys.list(limit), // ✅ flat key
    queryFn: ({ pageParam = 0 }) => fetchToolLogsPage({ pageParam, limit }),
    initialPageParam: 0,
    getNextPageParam: (last) => (last.hasMore ? last.nextOffset! : undefined),
    staleTime: 1_000,
    refetchOnWindowFocus: false,
  });
}

export function useToolLogsHead(limit = 10) {
  return useQuery({
    queryKey: toolLogKeys.head(limit), // ✅ flat key
    queryFn: () => fetchToolLogsPage({ pageParam: 0, limit }),
    refetchInterval: 3000,
    staleTime: 1_000,
  });
}
