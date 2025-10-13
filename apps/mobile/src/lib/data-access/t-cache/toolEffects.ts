import { getQueryClient } from '../core/queryClient';
import { toolLogKeys } from '../observability/tool-logs';

export function invalidateToolLogs() {
  const qc = getQueryClient();
  qc.invalidateQueries({ queryKey: toolLogKeys.all, exact: false });
}
