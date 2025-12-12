import { setTimeout as sleep } from 'node:timers/promises';

export type HttpMethod = 'GET' | 'POST' | 'PATCH';

export class HubspotHttp {
  constructor(
    private readonly base = process.env.HUBSPOT_BASE ||
      'https://api.hubapi.com',
    private readonly token = process.env.HUBSPOT_TOKEN || '',
  ) {
    if (!this.token) throw new Error('HUBSPOT_TOKEN missing');
  }

  private headers(json = true) {
    return {
      Authorization: `Bearer ${this.token}`,
      ...(json ? { 'Content-Type': 'application/json' } : {}),
    };
  }

  private buildUrl(
    path: string,
    qs?: Record<string, string | number | boolean | undefined>,
  ) {
    const url = new URL(path.startsWith('http') ? path : this.base + path);
    if (qs) {
      Object.entries(qs).forEach(([k, v]) => {
        if (v !== undefined && v !== null) url.searchParams.set(k, String(v));
      });
    }
    return url.toString();
  }

  // Simple retry on 429 with Retry-After (seconds)
  private async request<T>(
    method: HttpMethod,
    path: string,
    body?: unknown,
    qs?: Record<string, any>,
    attempt = 0,
  ): Promise<T> {
    const url = this.buildUrl(path, qs);
    const res = await fetch(url, {
      method,
      headers: this.headers(true),
      body: body ? JSON.stringify(body) : undefined,
    });

    if (res.status === 429) {
      const retryAfter = Number(res.headers.get('retry-after') || '1');
      if (attempt < 3) {
        await sleep((retryAfter || 1) * 1000);
        return this.request<T>(method, path, body, qs, attempt + 1);
      }
    }

    if (!res.ok) {
      let errBody: any;
      try {
        errBody = await res.json();
      } catch {
        errBody = await res.text();
      }
      const message =
        typeof errBody === 'string'
          ? errBody
          : errBody?.message || errBody?.error || 'HubSpot API error';
      const details = errBody?.category || errBody;
      const correlationId =
        errBody?.correlationId || res.headers.get('x-hubspot-correlation-id');
      const e = new Error(
        `HubSpot ${method} ${path} failed (${res.status}): ${message} (${correlationId ?? 'no-cid'})`,
      ) as Error & { status?: number; details?: any };
      e.status = res.status;
      e.details = details;
      throw e;
    }

    return (await res.json()) as T;
  }

  get<T>(path: string, qs?: Record<string, any>) {
    return this.request<T>('GET', path, undefined, qs);
  }
  post<T>(path: string, body?: unknown, qs?: Record<string, any>) {
    return this.request<T>('POST', path, body, qs);
  }
  patch<T>(path: string, body?: unknown, qs?: Record<string, any>) {
    return this.request<T>('PATCH', path, body, qs);
  }
}
