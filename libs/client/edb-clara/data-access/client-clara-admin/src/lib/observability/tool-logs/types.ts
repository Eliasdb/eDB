export type ToolLogEntry = {
  id: string;
  ts: number; // epoch ms
  name: string; // tool name (snake or dot form)
  durationMs: number;
  args?: unknown;
  result?: unknown;
  error?: string;
};

export type ToolLogPage = {
  items: ToolLogEntry[];
  total: number;
  offset: number;
  limit: number;
  nextOffset: number | null;
  hasMore: boolean;
};
