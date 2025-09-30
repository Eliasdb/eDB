// Central base from env or runtime injection
declare global {
  interface Window {
    CLARA_API_BASE?: string;
  }
}

const fromWindow =
  typeof window !== 'undefined' && window.CLARA_API_BASE
    ? window.CLARA_API_BASE
    : undefined;

export const API_BASE = (
  fromWindow ??
  process.env.EXPO_PUBLIC_API_BASE ??
  'http://127.0.0.1:9101'
).replace(/\/$/, '');

export async function api<T>(path: string, init: RequestInit = {}): Promise<T> {
  const hasBody = init.body != null;
  const res = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: {
      ...(hasBody ? { 'content-type': 'application/json' } : {}),
      ...(init.headers || {}),
    },
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`HTTP ${res.status} ${res.statusText} — ${text}`);
  }

  return (res.status === 204 ? undefined : await res.json()) as T;
}
