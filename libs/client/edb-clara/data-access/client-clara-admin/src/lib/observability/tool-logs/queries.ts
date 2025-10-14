import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { toolLogKeys } from './keys';
import { fetchToolLogsPage } from './service';

export function useToolLogsInfinite(limit = 10) {
  return useInfiniteQuery({
    queryKey: toolLogKeys.list(limit),
    queryFn: ({ pageParam = 0 }) => fetchToolLogsPage({ pageParam, limit }),
    initialPageParam: 0,
    getNextPageParam: (last) => (last.hasMore ? last.nextOffset! : undefined),
    staleTime: 1_000,
    refetchOnWindowFocus: false,
  });
}

export function useToolLogsHead(limit = 10) {
  return useQuery({
    queryKey: toolLogKeys.head(limit),
    queryFn: () => fetchToolLogsPage({ pageParam: 0, limit }),
    refetchInterval: 3000,
    staleTime: 1_000,
  });
}
