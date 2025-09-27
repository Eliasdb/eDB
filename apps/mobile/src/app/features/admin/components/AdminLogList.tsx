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
  return (
    <View style={{ flex: 1, backgroundColor: '#f6f7fb' }}>
      <FlatList<LogVM>
        data={items}
        keyExtractor={(x) => x.id}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
        renderItem={({ item }) => <AdminLogCard vm={item} />}
        ListFooterComponent={<View style={{ height: 12 }} />}
        ListEmptyComponent={
          <View style={{ padding: 16 }}>
            <Text style={{ color: '#8b9098' }}>
              No tool calls yet — trigger one and this page will update live.
            </Text>
          </View>
        }
      />
    </View>
  );
}
