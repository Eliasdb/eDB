// Centralized fetch wrapper + base URL
export const API_BASE =
  process.env.EXPO_PUBLIC_API_BASE?.replace(/\/$/, '') ||
  'http://127.0.0.1:9101';

export async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { 'content-type': 'application/json', ...(init?.headers || {}) },
    ...init,
  });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`HTTP ${res.status} ${res.statusText} — ${text}`);
  }
  if (res.status === 204) return undefined as unknown as T; // no content
  return (await res.json()) as T;
}
