import { API_BASE } from '../core/client';
import type { ToolLogsPayload } from '../core/types';

export async function fetchToolLogs(): Promise<ToolLogsPayload['items']> {
  const r = await fetch(`${API_BASE}/realtime/tool-logs`);
  if (!r.ok) throw new Error('Failed to fetch tool logs');
  const json = (await r.json()) as ToolLogsPayload;
  return json.items;
}
