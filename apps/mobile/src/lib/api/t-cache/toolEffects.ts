import { hubKeys, toolLogKeys } from '../core/keys';
import { getQueryClient } from '../core/queryClient';
import type { HubPayload } from '../core/types';

export type Kind = 'tasks' | 'contacts' | 'companies';
export const EMPTY: HubPayload = { tasks: [], contacts: [], companies: [] };

export function update(updater: (prev: HubPayload) => HubPayload) {
  const qc = getQueryClient();
  qc.setQueryData(hubKeys.all, (prev?: HubPayload) => updater(prev ?? EMPTY));
}

const toCanonical = (n: string) => (n.includes('.') ? n : n.replace('_', '.'));

export function applyToolEffectToCache(name: string, args: any, result?: any) {
  const canonical = toCanonical(name);

  switch (canonical) {
    case 'hub.create': {
      const { kind, data } = args as { kind: Kind; data: any };
      update((prev) => {
        const list = (prev[kind] as any[]) ?? [];
        if (result) {
          if (result.id) {
            const idx = list.findIndex((x) => x.id === result.id);
            if (idx !== -1) {
              const next = [...list];
              next[idx] = { ...list[idx], ...result };
              return { ...prev, [kind]: next } as any;
            }
          }
          const guess = list.findIndex(
            (x) =>
              !x.id &&
              ((x.title && x.title === result.title) ||
                (x.name && x.name === result.name)),
          );
          if (guess !== -1) {
            const next = [...list];
            next[guess] = { ...result };
            return { ...prev, [kind]: next } as any;
          }
          return { ...prev, [kind]: [...list, result] } as any;
        }
        return { ...prev, [kind]: [...list, data] } as any;
      });
      return;
    }

    case 'hub.update': {
      const { kind, id, patch } = args as {
        kind: Kind;
        id: string;
        patch: any;
      };
      const merged = result ?? patch;
      update(
        (prev) =>
          ({
            ...prev,
            [kind]: (prev[kind] as any[]).map((x: any) =>
              x.id === id ? { ...x, ...merged, id } : x,
            ),
          }) as any,
      );
      return;
    }

    case 'hub.delete': {
      const { kind, id } = args as { kind: Kind; id: string };
      update(
        (prev) =>
          ({
            ...prev,
            [kind]: (prev[kind] as any[]).filter((x: any) => x.id !== id),
          }) as any,
      );
      return;
    }

    default:
      if (__DEV__)
        console.warn('[toolEffects] unhandled tool:', canonical, args, result);
  }
}

export function invalidateHub() {
  getQueryClient().invalidateQueries({ queryKey: hubKeys.all });
}

export function invalidateToolLogs() {
  const qc = getQueryClient();
  qc.invalidateQueries({ queryKey: toolLogKeys.all, exact: false });
}
