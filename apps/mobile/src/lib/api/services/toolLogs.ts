// apps/mobile/src/app/services/toolLogs.ts
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
  const res = await fetch(
    `http://localhost:9101/realtime/tool-logs?offset=${pageParam}&limit=${limit}`,
  );
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}
