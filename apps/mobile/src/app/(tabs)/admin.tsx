import AdminLogList from '@features/admin/components/AdminLogList';
import { useToolLogs } from '@features/admin/hooks/useToolLogs';
import { useMemo } from 'react';
import { entryToVM } from '../../lib/viewmodels/toolLogs';

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
