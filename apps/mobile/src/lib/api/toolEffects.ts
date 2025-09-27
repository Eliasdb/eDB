// apps/mobile/src/lib/api/toolEffects.ts
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
  const canonical = toCanonical(name); // <-- not /_/g !

  switch (canonical) {
    case 'hub.create': {
      const { kind, data } = args as { kind: Kind; data: any };
      const item = result ?? data;
      update((prev) => ({ ...prev, [kind]: [item, ...prev[kind]] }) as any);
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
            [kind]: prev[kind].map((x: any) =>
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
            [kind]: prev[kind].filter((x: any) => x.id !== id),
          }) as any,
      );
      return;
    }
    // Optional: during dev, warn if an unexpected tool name comes through
    default:
      if (__DEV__) {
        // eslint-disable-next-line no-console
        console.warn('[toolEffects] unhandled tool:', canonical, args, result);
      }
  }
}

export function invalidateHub() {
  getQueryClient().invalidateQueries({ queryKey: hubKeys.all });
}
