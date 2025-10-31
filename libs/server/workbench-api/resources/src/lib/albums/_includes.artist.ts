import type { FastifyRequest } from 'fastify';
import type { RepoAdapters } from '../register';

function pick<T extends Record<string, any>>(obj: T, keys: string[]) {
  const out: any = {};
  for (const k of keys)
    if (Object.prototype.hasOwnProperty.call(obj, k)) out[k] = (obj as any)[k];
  return out;
}

function wants(req: FastifyRequest, key: string) {
  const raw = (req.query as any)?.include;
  if (!raw) return false;
  const set = new Set(
    String(raw)
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean),
  );
  return set.has(key);
}

export const applyAlbumIncludes = {
  async list(req: FastifyRequest, out: any, adapters?: RepoAdapters) {
    if (!adapters || !wants(req, 'artist') || !out?.items?.length) return out;
    const idsRaw = out.items
      .map((r: any) => r.artistId ?? r.artistId ?? r.artist_id ?? r.artist_id)
      .filter((x: any) => !!x);
    const ids: string[] = Array.from(
      new Set(idsRaw.map((x: any) => String(x))),
    );
    if (ids.length === 0) return out;

    const map = new Map<string, any>();
    await Promise.all(
      ids.map(async (id: string) => {
        const p = await (adapters as any).artist.getById(id);
        if (p) map.set(id, p);
      }),
    );

    out.items = out.items.map((r: any) => {
      const pid = r.artistId ?? r.artistId ?? r.artist_id ?? r.artist_id;
      const sid = pid ? String(pid) : undefined;
      const val = sid ? map.get(sid) : undefined;
      return val ? { ...r, artist: pick(val, ['id', 'name', 'status']) } : r;
    });
    return out;
  },

  async one(req: FastifyRequest, out: any, adapters?: RepoAdapters) {
    if (!adapters || !wants(req, 'artist') || !out?.album) return out;
    const r = out.album;
    const pid = r.artistId ?? r.artistId ?? r.artist_id ?? r.artist_id;
    if (!pid) return out;

    const val = await (adapters as any).artist.getById(String(pid));
    if (val) out.album.artist = pick(val, ['id', 'name', 'status']);
    return out;
  },
};
