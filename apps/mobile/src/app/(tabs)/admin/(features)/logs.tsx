// apps/mobile/src/app/(tabs)/admin/logs.tsx
import { useToolLogs } from '@api';
import { entryToVM } from '@api/viewmodels/toolLogs';
import { AdminLogList } from '@features/admin';
import { useMemo } from 'react';

export default function AdminLogsScreen() {
  const { data = [], isLoading, isRefetching, refetch } = useToolLogs();
  const items = useMemo(() => data.map(entryToVM), [data]);

  return (
    <AdminLogList
      items={items}
      refreshing={!!isRefetching && !isLoading}
      onRefresh={refetch}
    />
  );
}
