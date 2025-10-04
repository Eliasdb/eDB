// apps/mobile/src/app/(features)/admin/logs/AdminLogList.tsx
import React, { useCallback, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, FlatList, Text, View } from 'react-native';

import { Segmented } from '../../../ui/primitives';
import { AdminLogCard } from './AdminLogCard';
import AdminLogTerminal from './AdminLogTerminal';

import { useToolLogsInfinite } from '@api/hooks/useToolLogs';
import type { LogVM } from '@api/viewmodels/toolLogs';
import { entryToVM } from '@api/viewmodels/toolLogs';

type ViewMode = 'cards' | 'terminal';
const PAGE_SIZE = 10;

export function AdminLogList() {
  const { t } = useTranslation();
  const [mode, setMode] = useState<ViewMode>('cards');

  const Header = useMemo(
    () => (
      <View className="px-4 pt-5 pb-3">
        <View className="flex-row items-center justify-between">
          <Text className="text-[18px] font-extrabold text-text dark:text-text-dark">
            Activity logs
          </Text>
          <Segmented<ViewMode>
            value={mode}
            onChange={setMode}
            options={[
              { value: 'cards', label: 'Cards' },
              { value: 'terminal', label: 'Terminal' },
            ]}
          />
        </View>
        <Text className="mt-1 text-[13px] leading-5 text-text-dim dark:text-text-dimDark">
          Review the actions Clara has taken: creations, updates, deletions and
          snapshots. Switch to the terminal view for a compact, columnar list.
        </Text>
      </View>
    ),
    [mode],
  );

  // -------- cards: infinite query --------
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

  // -------- endReached guard: fire only after user scrolls, once per gesture
  const userHasScrolledRef = useRef(false);
  const loadingMoreRef = useRef(false);
  const lastTriggerCountRef = useRef<number>(-1);

  const tryFetchNext = useCallback(() => {
    if (loadingMoreRef.current) return;
    if (!hasNextPage || isFetchingNextPage) return;
    loadingMoreRef.current = true;
    fetchNextPage().finally(() => {
      // lock endReached until the next user scroll gesture
      userHasScrolledRef.current = false;
      lastTriggerCountRef.current = items.length;
      // let momentum settle
      setTimeout(() => (loadingMoreRef.current = false), 80);
    });
  }, [hasNextPage, isFetchingNextPage, fetchNextPage, items.length]);

  const onEndReachedGuarded = useCallback(() => {
    // must have scrolled + don’t retrigger for same item count
    if (!userHasScrolledRef.current) return;
    if (items.length === lastTriggerCountRef.current) return;
    tryFetchNext();
  }, [items.length, tryFetchNext]);

  if (mode === 'terminal') {
    return (
      <View className="flex-1 bg-surface dark:bg-surface-dark">
        {Header}
        <AdminLogTerminal emptyText={t('admin.logs.empty')} />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-surface dark:bg-surface-dark">
      <FlatList
        data={items}
        keyExtractor={(x) => x.id}
        ListHeaderComponent={Header}
        ListHeaderComponentStyle={{ marginBottom: 12 }}
        ItemSeparatorComponent={() => <View className="h-3" />}
        renderItem={({ item }) => <AdminLogCard vm={item} />}
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
        contentContainerStyle={{ paddingBottom: 20 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        refreshing={!!isRefetching && !isLoading}
        onRefresh={() => {
          // reset guards on pull-to-refresh
          userHasScrolledRef.current = false;
          lastTriggerCountRef.current = -1;
          refetch();
        }}
        // unlock endReached only after the user actually scrolls
        onScrollBeginDrag={() => {
          userHasScrolledRef.current = true;
        }}
        onMomentumScrollBegin={() => {
          userHasScrolledRef.current = true;
        }}
        onEndReached={onEndReachedGuarded}
        onEndReachedThreshold={0.2}
        initialNumToRender={10}
        windowSize={10}
        removeClippedSubviews
      />
    </View>
  );
}
