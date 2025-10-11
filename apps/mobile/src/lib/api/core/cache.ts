// api/core/cache.ts
import {
  activityKeys,
  companyKeys,
  contactKeys,
  hubKeys,
  taskKeys,
} from './keys';
import { getQueryClient } from './queryClient';

// narrow kind type you already use for tools
type Kind = 'tasks' | 'contacts' | 'companies' | 'activities';

const toCanonical = (n: string) => (n.includes('.') ? n : n.replace('_', '.'));

export function invalidateHub() {
  getQueryClient().invalidateQueries({ queryKey: hubKeys.all });
}

export function invalidateAfterTool(name: string, args: any, result?: any) {
  const qc = getQueryClient();
  const tool = toCanonical(name);

  const invalidateCompany = (id?: string | null) => {
    if (!id) return;
    qc.invalidateQueries({ queryKey: companyKeys.item(id) });
    qc.invalidateQueries({ queryKey: companyKeys.overview(id) });
  };

  const invalidateContact = (id?: string | null) => {
    if (!id) return;
    qc.invalidateQueries({ queryKey: contactKeys.item(id) });
    qc.invalidateQueries({ queryKey: contactKeys.activities(id) });
  };

  const invalidateLists = (kind: Kind) => {
    switch (kind) {
      case 'companies':
        qc.invalidateQueries({ queryKey: companyKeys.list() });
        break;
      case 'contacts':
        qc.invalidateQueries({ queryKey: contactKeys.list() });
        break;
      case 'tasks':
        qc.invalidateQueries({ queryKey: taskKeys.list() });
        break;
      case 'activities':
        qc.invalidateQueries({ queryKey: activityKeys.list() });
        break;
    }
  };

  switch (tool) {
    case 'hub.create': {
      const { kind, data } = args as { kind: Kind; data: any };
      invalidateLists(kind);

      // relationship side-effects
      if (kind === 'tasks') {
        invalidateCompany(data.companyId);
        invalidateContact(data.contactId);
      }
      if (kind === 'activities') {
        invalidateCompany(data.companyId);
        invalidateContact(data.contactId);
      }
      if (kind === 'contacts') {
        invalidateCompany(data.companyId);
      }
      break;
    }

    case 'hub.update': {
      const { kind, id, patch } = args as {
        kind: Kind;
        id: string;
        patch: any;
      };
      const merged = { ...(result ?? {}), ...(patch ?? {}) };

      invalidateLists(kind);

      if (kind === 'companies') {
        invalidateCompany(id);
      }
      if (kind === 'contacts') {
        invalidateContact(id);
        // moving contact between companies affects both overviews
        invalidateCompany(merged.companyId);
      }
      if (kind === 'tasks') {
        invalidateCompany(merged.companyId);
        invalidateContact(merged.contactId);
      }
      if (kind === 'activities') {
        invalidateCompany(merged.companyId);
        invalidateContact(merged.contactId);
      }
      break;
    }

    case 'hub.delete': {
      const { kind, id } = args as { kind: Kind; id: string };
      invalidateLists(kind);

      if (kind === 'companies') {
        invalidateCompany(id);
        // also: contacts/tasks/activities lists will refresh via list invalidation
      }
      if (kind === 'contacts') {
        invalidateContact(id);
      }
      if (kind === 'tasks') {
        // no item key by id? list invalidation is enough
      }
      if (kind === 'activities') {
        // list invalidation is enough, but overview may need refresh if it was nextTask/lastActivity
      }
      break;
    }

    default:
      // noop
      break;
  }

  // while migrating keep the snapshot fresh:
  invalidateHub();
}
