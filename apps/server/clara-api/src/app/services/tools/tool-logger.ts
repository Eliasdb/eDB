// Lightweight in-memory tool usage log (no DB).

export type ToolLogEntry = {
  id: string;
  ts: number; // epoch ms
  name: string;
  durationMs: number;
  args?: unknown;
  result?: unknown;
  error?: string;
};

const MAX = 500;
const _logs: ToolLogEntry[] = [];

// Keep payloads reasonable so logs don't explode.
const MAX_JSON_CHARS = 16_000;
function shrink(v: any) {
  try {
    const s = JSON.stringify(v);
    if (s.length <= MAX_JSON_CHARS) return v;
    return { _truncated: true, preview: s.slice(0, MAX_JSON_CHARS) + '…' };
  } catch {
    return v;
  }
}

export function add(entry: Omit<ToolLogEntry, 'id' | 'ts'>) {
  const e: ToolLogEntry = {
    id: `${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`,
    ts: Date.now(),
    name: entry.name,
    durationMs: entry.durationMs,
    args: shrink(entry.args),
    result: shrink(entry.result),
    error: entry.error,
  };
  _logs.push(e);
  if (_logs.length > MAX) _logs.splice(0, _logs.length - MAX);
  return e;
}

/** Return all, newest first (copy). */
export function all(): ToolLogEntry[] {
  return [..._logs].reverse();
}

export function clear() {
  _logs.length = 0;
}

/** Efficient newest-first pagination without reversing the whole buffer. */
export function page(opts?: { offset?: number; limit?: number }) {
  const total = _logs.length;
  const offset = Math.max(0, Number(opts?.offset ?? 0) || 0);
  const rawLimit = Number(opts?.limit ?? 10) || 10;
  const limit = Math.min(Math.max(1, rawLimit), 100); // clamp 1..100

  // newest-first window over the ring buffer
  const endIndexExclusiveDesc = offset + limit; // in "desc order units"
  const startIdx = Math.max(total - endIndexExclusiveDesc, 0); // inclusive in _logs[]
  const endIdx = Math.max(total - offset, 0); // exclusive in _logs[]

  const items: ToolLogEntry[] = [];
  for (let i = endIdx - 1; i >= startIdx; i--) {
    items.push(_logs[i]);
  }

  const nextOffset = endIdx - startIdx < limit ? null : offset + items.length;
  const hasMore = nextOffset !== null && nextOffset < total;

  return {
    items,
    total,
    offset,
    limit,
    nextOffset,
    hasMore,
  };
}

export async function withToolLog<T>(
  name: string,
  args: unknown,
  fn: () => Promise<T>,
): Promise<T> {
  const t0 = Date.now();
  try {
    const res = await fn();
    add({ name, durationMs: Date.now() - t0, args, result: res });
    return res;
  } catch (err: any) {
    add({
      name,
      durationMs: Date.now() - t0,
      args,
      error: err?.message ?? String(err),
    });
    throw err;
  }
}
