// data-access/core/cache.ts
import { activityKeys } from '../activities';
import { invalidateCompany, invalidateCompanyLists } from '../companies/cache';
import { contactKeys } from '../contacts/keys';
import { taskKeys } from '../tasks';
import { hubKeys } from './keys';
import { getQueryClient } from './queryClient';

type Kind = 'tasks' | 'contacts' | 'companies' | 'activities';
type EntityPatch = {
  companyId?: string | null;
  contactId?: string | null;
  [k: string]: unknown;
};

const isRecord = (val: unknown): val is Record<string, unknown> =>
  !!val && typeof val === 'object' && !Array.isArray(val);

const asPatch = (val: unknown): EntityPatch =>
  isRecord(val) ? (val as EntityPatch) : {};

const asKindArgs = (val: unknown): { kind: Kind } | null =>
  isRecord(val) && typeof val.kind === 'string'
    ? ({ kind: val.kind } as { kind: Kind })
    : null;

export function invalidateHub() {
  getQueryClient().invalidateQueries({ queryKey: hubKeys.all });
}

const safeId = (maybeId: unknown): string | null =>
  typeof maybeId === 'string' ? maybeId : null;

export function invalidateAfterTool(
  name: string,
  args: unknown,
  result?: unknown,
) {
  const qc = getQueryClient();
  const tool = name.includes('.') ? name : name.replace('_', '.');

  const invContact = (id?: string | null) => {
    if (!id) return;
    qc.invalidateQueries({ queryKey: contactKeys.item(id) });
    qc.invalidateQueries({ queryKey: contactKeys.activities(id) });
  };

  const invLists = (kind: Kind) => {
    if (kind === 'companies') return invalidateCompanyLists(qc);
    if (kind === 'contacts')
      return qc.invalidateQueries({ queryKey: contactKeys.list() });
    if (kind === 'tasks')
      return qc.invalidateQueries({ queryKey: taskKeys.list() });
    if (kind === 'activities')
      return qc.invalidateQueries({ queryKey: activityKeys.list() });
  };

  const parsedArgs = asKindArgs(args);

  switch (tool) {
    case 'hub.create': {
      const { kind, data } = (parsedArgs ?? { kind: undefined as never })
        ? (args as { kind: Kind; data?: EntityPatch })
        : { kind: undefined as never, data: undefined };
      const patch = asPatch(data);
      invLists(kind);
      if (kind === 'tasks' || kind === 'activities') {
        invalidateCompany(qc, safeId(patch.companyId));
        invContact(safeId(patch.contactId));
      }
      if (kind === 'contacts') invalidateCompany(qc, safeId(patch.companyId));
      break;
    }

    case 'hub.update': {
      const { kind, id, patch } = (parsedArgs ?? { kind: undefined as never })
        ? (args as { kind: Kind; id: string; patch?: EntityPatch })
        : { kind: undefined as never, id: '', patch: undefined };
      const merged = { ...asPatch(result), ...asPatch(patch) };
      invLists(kind);
      if (kind === 'companies') invalidateCompany(qc, id);
      if (kind === 'contacts') {
        invContact(id);
        invalidateCompany(qc, safeId(merged.companyId));
      }
      if (kind === 'tasks' || kind === 'activities') {
        invalidateCompany(qc, safeId(merged.companyId));
        invContact(safeId(merged.contactId));
      }
      break;
    }

    case 'hub.delete': {
      const { kind } = (parsedArgs ?? { kind: undefined as never })
        ? (args as { kind: Kind; id: string })
        : { kind: undefined as never, id: '' };
      const prev = asPatch(isRecord(result) ? result.prev : undefined); // from server change
      invLists(kind);

      if (kind === 'companies') {
        invalidateCompany(qc, safeId(prev.id)); // overview page of the deleted company
      }

      if (kind === 'contacts') {
        invContact(safeId(prev.id));
        invalidateCompany(qc, safeId(prev.companyId));
      }

      if (kind === 'tasks') {
        invalidateCompany(qc, safeId(prev.companyId));
        invContact(safeId(prev.contactId));
      }

      if (kind === 'activities') {
        invalidateCompany(qc, safeId(prev.companyId));
        invContact(safeId(prev.contactId));
      }
      break;
    }
  }

  invalidateHub();
}
