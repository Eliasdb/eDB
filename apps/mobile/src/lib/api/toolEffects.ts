// apps/mobile/src/lib/api/toolEffects.ts
import { toolLogKeys } from '../../app/features/admin/hooks/useToolLogs';
import { hubKeys } from './hooks';
import { getQueryClient } from './queryClient';
import type { HubPayload } from './types';

type Kind = 'tasks' | 'contacts' | 'companies';

const EMPTY: HubPayload = { tasks: [], contacts: [], companies: [] };

function update(updater: (prev: HubPayload) => HubPayload) {
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

        // If server result is present, try to replace an optimistic row
        if (result) {
          // replace by id if we have one
          if (result.id) {
            const byId = list.findIndex((x) => x.id === result.id);
            if (byId !== -1) {
              const next = [...list];
              next[byId] = { ...list[byId], ...result };
              return { ...prev, [kind]: next } as any;
            }
          }

          // fallback: replace the first optimistic row that matches core fields
          const guess = list.findIndex(
            (x) =>
              !x.id && // optimistic items usually have no id
              ((x.title && x.title === result.title) ||
                (x.name && x.name === result.name)),
          );
          if (guess !== -1) {
            const next = [...list];
            next[guess] = { ...result };
            return { ...prev, [kind]: next } as any;
          }

          // otherwise append the server item
          return { ...prev, [kind]: [...list, result] } as any;
        }

        // optimistic path (no result yet): append, don’t prepend
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

    default: {
      if (__DEV__) {
        // eslint-disable-next-line no-console
        console.warn('[toolEffects] unhandled tool:', canonical, args, result);
      }
    }
  }
}

export function invalidateHub() {
  getQueryClient().invalidateQueries({ queryKey: hubKeys.all });
}

export function invalidateToolLogs() {
  const qc = getQueryClient();
  qc.invalidateQueries({ queryKey: toolLogKeys.all });
}
