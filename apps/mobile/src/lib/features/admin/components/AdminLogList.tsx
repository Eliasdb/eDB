import { useMemo, useState } from 'react';
import { FlatList, ScrollView, Text, View } from 'react-native';

import { useTranslation } from 'react-i18next';

import { AdminLogCard } from './AdminLogCard';
import AdminLogTerminal from './AdminLogTerminal';

import type { LogVM } from '@api/viewmodels/toolLogs';
import { Segmented } from '../../../ui/primitives';

type ViewMode = 'cards' | 'terminal';

export function AdminLogList({
  items,
  refreshing,
  onRefresh,
  onEndReached,
  loadingMore,
  hasMore,
}: {
  items: LogVM[];
  refreshing: boolean;
  onRefresh: () => void;
  onEndReached?: () => void;
  loadingMore?: boolean;
  hasMore?: boolean;
}) {
  const { t } = useTranslation();
  const [mode, setMode] = useState<'cards' | 'terminal'>('cards');

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

  if (mode === 'terminal') {
    return (
      <View className="flex-1 bg-surface dark:bg-surface-dark">
        <ScrollView contentContainerStyle={{ paddingBottom: 24 }}>
          {Header}
          <AdminLogTerminal emptyText={t('admin.logs.empty')} />
        </ScrollView>
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
        ListFooterComponent={
          loadingMore ? (
            <View className="p-4">
              <Text className="text-center text-text-dim dark:text-text-dimDark">
                Loading more…
              </Text>
            </View>
          ) : !hasMore ? (
            <View className="p-4">
              <Text className="text-center text-text-dim dark:text-text-dimDark">
                No more logs
              </Text>
            </View>
          ) : (
            <View className="h-6" />
          )
        }
        ListEmptyComponent={
          <View className="p-6">
            <Text className="text-text-dim dark:text-text-dimDark text-center">
              {t('admin.logs.empty')}
            </Text>
          </View>
        }
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingBottom: 20 }}
        refreshing={refreshing}
        onRefresh={onRefresh}
        onEndReached={onEndReached}
        onEndReachedThreshold={0.3}
      />
    </View>
  );
}
