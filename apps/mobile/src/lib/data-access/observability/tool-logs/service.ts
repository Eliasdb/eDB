import type { ToolLogPage } from './types';

// Centralize base in one place (optional: re-export from core/client)
const API_BASE = (
  process.env.EXPO_PUBLIC_API_BASE ?? 'http://127.0.0.1:9101'
).replace(/\/$/, '');

export async function fetchToolLogsPage({
  pageParam = 0,
  limit = 10,
}: {
  pageParam?: number;
  limit?: number;
}): Promise<ToolLogPage> {
  const url = `${API_BASE}/realtime/tool-logs?offset=${pageParam}&limit=${limit}`;

  const t0 = Date.now();
  const res = await fetch(url);

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    console.warn('[LOGS] HTTP error', res.status, text);
    throw new Error(`HTTP ${res.status}`);
  }

  const json = (await res.json()) as ToolLogPage;

  // Optional debug
  if (__DEV__) {
    console.log('[LOGS] page', {
      url,
      status: res.status,
      took: Date.now() - t0 + 'ms',
      offset: json.offset,
      next: json.nextOffset,
      count: json.items?.length ?? 0,
    });
  }

  return json;
}
