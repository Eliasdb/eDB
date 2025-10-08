import { useToolLogsInfinite } from '@api/hooks/useToolLogs';
import { useCallback, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { ActivityIndicator, FlatList, Text, View } from 'react-native';
import { AdminLogsCard } from '../admin-logs-card/admin-logs-card';
import { AdminLogsHeader } from '../admin-logs-header/admin-logs-header';
import AdminLogsTerminal from '../admin-logs-terminal/admin-logs-terminal';

import type { LogVM } from '@api/viewmodels/toolLogs';
import { entryToVM } from '@api/viewmodels/toolLogs';

type ViewMode = 'cards' | 'terminal';
const PAGE_SIZE = 10;

export function AdminLogsContainer() {
  const { t } = useTranslation();
  const [mode, setMode] = useState<ViewMode>('cards');

  // data for Cards view
  const {
    data,
    isLoading,
    isRefetching,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useToolLogsInfinite(PAGE_SIZE);

  const items: LogVM[] = useMemo(() => {
    const pages = data?.pages ?? [];
    return pages.flatMap((p) => p.items).map(entryToVM);
  }, [data]);

  // endReached guard
  const userHasScrolledRef = useRef(false);
  const loadingMoreRef = useRef(false);
  const lastTriggerCountRef = useRef<number>(-1);

  const tryFetchNext = useCallback(() => {
    if (loadingMoreRef.current) return;
    if (!hasNextPage || isFetchingNextPage) return;
    loadingMoreRef.current = true;
    fetchNextPage().finally(() => {
      userHasScrolledRef.current = false;
      lastTriggerCountRef.current = items.length;
      setTimeout(() => (loadingMoreRef.current = false), 80);
    });
  }, [hasNextPage, isFetchingNextPage, fetchNextPage, items.length]);

  const onEndReachedGuarded = useCallback(() => {
    if (!userHasScrolledRef.current) return;
    if (items.length === lastTriggerCountRef.current) return;
    tryFetchNext();
  }, [items.length, tryFetchNext]);

  return (
    <View className="flex-1 bg-surface dark:bg-surface-dark">
      {/* ✅ Shared, non-scrolling header */}
      <AdminLogsHeader mode={mode} onChange={setMode} />

      {mode === 'terminal' ? (
        // Terminal keeps its own table column header internally
        <AdminLogsTerminal emptyText={t('admin.logs.empty')} />
      ) : (
        <FlatList
          data={items}
          keyExtractor={(x) => x.id}
          // ❌ Removed ListHeaderComponent={Header}
          ItemSeparatorComponent={() => <View className="h-3" />}
          renderItem={({ item }) => <AdminLogsCard vm={item} />}
          ListEmptyComponent={
            !isLoading ? (
              <View className="p-6">
                <Text className="text-text-dim dark:text-text-dimDark text-center">
                  {t('admin.logs.empty')}
                </Text>
              </View>
            ) : null
          }
          ListFooterComponent={
            isFetchingNextPage ? (
              <View className="p-4">
                <ActivityIndicator />
              </View>
            ) : data && !hasNextPage ? (
              <View className="p-4">
                <Text className="text-center text-text-dim dark:text-text-dimDark">
                  No more logs
                </Text>
              </View>
            ) : (
              <View className="h-6" />
            )
          }
          contentContainerStyle={{ paddingBottom: 20, paddingTop: 12 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          refreshing={!!isRefetching && !isLoading}
          onRefresh={() => {
            userHasScrolledRef.current = false;
            lastTriggerCountRef.current = -1;
            refetch();
          }}
          onScrollBeginDrag={() => (userHasScrolledRef.current = true)}
          onMomentumScrollBegin={() => (userHasScrolledRef.current = true)}
          onEndReached={onEndReachedGuarded}
          onEndReachedThreshold={0.2}
          initialNumToRender={10}
          windowSize={10}
          removeClippedSubviews
        />
      )}
    </View>
  );
}
