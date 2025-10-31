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

export const applyMissionIncludes = {
  async list(req: FastifyRequest, out: any, adapters?: RepoAdapters) {
    if (!adapters || !wants(req, 'agent') || !out?.items?.length) return out;
    const rawIds = out.items.map(
      (r: any) => r.agentId ?? r.agentId ?? r.agent_id ?? r.agent_id,
    );
    const ids: string[] = Array.from(
      new Set(
        rawIds.filter(
          (x: string | any[]): x is string =>
            typeof x === 'string' && x.length > 0,
        ),
      ),
    );
    if (ids.length === 0) return out;

    const map = new Map<string, any>();
    await Promise.all(
      ids.map(async (id: string) => {
        const p = await (adapters as any).agent.getById(id);
        if (p) map.set(id, p);
      }),
    );

    out.items = out.items.map((r: any) => {
      const pid: string | undefined =
        r.agentId ?? r.agentId ?? r.agent_id ?? r.agent_id;
      const val = pid ? map.get(pid) : undefined;
      return val
        ? { ...r, agent: pick(val, ['id', 'codename', 'status', 'clearance']) }
        : r;
    });
    return out;
  },

  async one(req: FastifyRequest, out: any, adapters?: RepoAdapters) {
    if (!adapters || !wants(req, 'agent') || !out?.mission) return out;
    const r = out.mission;
    const pid: string | undefined =
      r.agentId ?? r.agentId ?? r.agent_id ?? r.agent_id;
    if (!pid) return out;

    const val = await (adapters as any).agent.getById(pid);
    if (val)
      out.mission.agent = pick(val, ['id', 'codename', 'status', 'clearance']);
    return out;
  },
};
