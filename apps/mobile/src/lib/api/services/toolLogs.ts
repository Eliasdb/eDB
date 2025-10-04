type Page = {
  items: any[]; // ToolLogEntry[]
  total: number;
  offset: number;
  limit: number;
  nextOffset: number | null;
  hasMore: boolean;
};

export async function fetchToolLogsPage({
  pageParam = 0,
  limit = 10,
}: {
  pageParam?: number;
  limit?: number;
}): Promise<Page> {
  const url = `https://api.staging.eliasdebock.com/clara/realtime/tool-logs?offset=${pageParam}&limit=${limit}`;
  console.log('[LOGS] FETCH start', { url });

  const t0 = Date.now();
  const res = await fetch(url);

  console.log('[LOGS] FETCH done', {
    url,
    status: res.status,
    ok: res.ok,
    took: Date.now() - t0 + 'ms',
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    console.warn('[LOGS] FETCH error body', text);
    throw new Error(`HTTP ${res.status}`);
  }

  const json = await res.json();
  console.log('[LOGS] FETCH parsed', {
    offset: json.offset,
    limit: json.limit,
    next: json.nextOffset,
    hasMore: json.hasMore,
    count: json.items?.length ?? 0,
  });

  return json;
}
