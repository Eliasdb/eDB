export function safeParseJSON<T = any>(s: unknown, fallback: T = {} as T): T {
  try {
    return typeof s === 'string' ? JSON.parse(s) : ((s ?? fallback) as T);
  } catch {
    return fallback;
  }
}

export function buildAuthHeaders(bearer?: string): HeadersInit {
  const h: HeadersInit = { 'content-type': 'application/json' };
  if (bearer) h['Authorization'] = `Bearer ${bearer}`;
  return h;
}

export function createAudioSink() {
  const el = new Audio();
  el.autoplay = true;
  el.setAttribute('playsinline', 'true'); // iOS Safari
  return el;
}
