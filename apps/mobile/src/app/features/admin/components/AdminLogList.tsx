// apps/mobile/src/app/(features)/admin/logs/AdminLogList.tsx
import { useTranslation } from 'react-i18next';
import { FlatList, RefreshControl, Text, View } from 'react-native';
import type { LogVM } from '../../../../lib/viewmodels/toolLogs';
import AdminLogCard from './AdminLogCard';
import ClaraCapabilities from './ClaraCapabilities';

export default function AdminLogList({
  items,
  refreshing,
  onRefresh,
}: {
  items: LogVM[];
  refreshing: boolean;
  onRefresh: () => void;
}) {
  const { t } = useTranslation();

  return (
    <View className="flex-1 bg-surface dark:bg-surface-dark">
      <FlatList<LogVM>
        data={items}
        keyExtractor={(x) => x.id}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        // 👇 Header: capabilities + intro for logs
        ListHeaderComponent={
          <View className="px-4 pt-5 pb-3">
            <ClaraCapabilities />

            <View className="mt-6">
              <Text className="text-[18px] font-extrabold text-text dark:text-text-dark">
                Activity logs
              </Text>
              <Text className="mt-1 text-[13px] leading-5 text-text-dim dark:text-text-dimDark">
                Here you can review the actions Clara has taken — including task
                creation, updates, deletions, and snapshots. Each entry shows
                the tool used, duration, and any returned results.
              </Text>
            </View>
          </View>
        }
        ListHeaderComponentStyle={{ marginBottom: 12 }}
        ItemSeparatorComponent={() => <View className="h-3" />}
        renderItem={({ item }) => <AdminLogCard vm={item} />}
        ListFooterComponent={<View className="h-6" />}
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
      />
    </View>
  );
}
