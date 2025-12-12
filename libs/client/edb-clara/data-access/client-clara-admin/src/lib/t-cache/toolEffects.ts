import { getQueryClient } from '@edb-clara/client-crm';
import { toolLogKeys } from '../observability/tool-logs';

export function invalidateToolLogs() {
  const qc = getQueryClient();
  qc.invalidateQueries({ queryKey: toolLogKeys.all, exact: false });
}
