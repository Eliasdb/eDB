import { useMemo, useState } from 'react';
import { ScrollView, Text } from 'react-native';

import { AdminLogList, ClaraCapabilities } from '@features/admin';
import { ResponsiveTabsLayout } from '@ui/layout';

import { useToolLogs } from '@api';
import { entryToVM } from '@api/viewmodels/toolLogs';

type Tab = 'capabilities' | 'logs';

export default function AdminScreen() {
  const [tab, setTab] = useState<Tab>('capabilities');
  const { data = [], isLoading, isRefetching, refetch } = useToolLogs();
  const items = useMemo(() => data.map(entryToVM), [data]);

  return (
    <ResponsiveTabsLayout
      tabs={[
        { key: 'capabilities', label: 'Capabilities' },
        { key: 'logs', label: 'Logs' },
      ]}
      value={tab}
      onChange={setTab}
      sidebarTitle="Admin"
      sidebarFooter={
        <Text className="text-[12px] text-text-dim dark:text-text-dimDark">
          Review tools and audit activity.
        </Text>
      }
    >
      {tab === 'capabilities' ? (
        <ScrollView
          className="flex-1"
          contentContainerStyle={{
            paddingHorizontal: 16,
            paddingTop: 20,
            paddingBottom: 20, // keeps bottom spacing balanced
          }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <ClaraCapabilities />
        </ScrollView>
      ) : (
        <AdminLogList
          items={items}
          refreshing={!!isRefetching && !isLoading}
          onRefresh={refetch}
        />
      )}
    </ResponsiveTabsLayout>
  );
}
