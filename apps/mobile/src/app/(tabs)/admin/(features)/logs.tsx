// (tabs)/admin/logs.tsx
import { useToolLogsHead, useToolLogsInfinite } from '@api/hooks/useToolLogs';
import { entryToVM } from '@api/viewmodels/toolLogs';
import { AdminLogList } from '@features/admin';
import { useQueryClient } from '@tanstack/react-query';
import { useMemo } from 'react';

export default function AdminLogsScreen() {
  const limit = 10;
  const queryClient = useQueryClient();

  const {
    data,
    isLoading,
    isRefetching,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useToolLogsInfinite(limit);

  const { data: head } = useToolLogsHead(limit);

  // Replace page[0] with head page when it changes (avoid refetching all pages)
  // useEffect(() => {
  //   if (!head) return;
  //   queryClient.setQueryData<any>(
  //     ['tool-logs', limit],
  //     (old: { pages: string | any[] }) => {
  //       if (!old) return { pageParams: [0], pages: [head] };
  //       const prevHead = old.pages?.[0] as typeof head | undefined;
  //       // If nothing changed, do nothing
  //       if (prevHead && prevHead.items?.[0]?.id === head.items?.[0]?.id)
  //         return old;
  //       return {
  //         ...old,
  //         pages: [head, ...(old.pages?.slice(1) ?? [])],
  //       };
  //     },
  //   );
  // }, [head, queryClient, limit]);

  const items = useMemo(() => {
    const pages = data?.pages ?? [];
    return pages.flatMap((p) => p.items).map(entryToVM);
  }, [data]);

  return (
    <AdminLogList
      items={items}
      refreshing={!!isRefetching && !isLoading}
      onRefresh={() => refetch()}
      onEndReached={() => {
        if (hasNextPage && !isFetchingNextPage) fetchNextPage();
      }}
      loadingMore={isFetchingNextPage}
      hasMore={!!hasNextPage}
    />
  );
}
