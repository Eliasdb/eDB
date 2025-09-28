// apps/mobile/src/app/(features)/admin/logs/AdminLogList.tsx
import { useTranslation } from 'react-i18next';
import { FlatList, RefreshControl, Text, View } from 'react-native';
import type { LogVM } from '../../../../lib/viewmodels/toolLogs';
import AdminLogCard from './AdminLogCard';

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
        ItemSeparatorComponent={() => <View className="h-2" />}
        renderItem={({ item }) => <AdminLogCard vm={item} />}
        ListFooterComponent={<View className="h-3" />}
        ListEmptyComponent={
          <View className="p-4">
            <Text className="text-text-dim dark:text-text-dimDark">
              {t('admin.logs.empty')}
            </Text>
          </View>
        }
      />
    </View>
  );
}
