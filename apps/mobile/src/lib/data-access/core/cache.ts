// data-access/core/cache.ts
import { activityKeys } from '../crm/activities';
import {
  invalidateCompany,
  invalidateCompanyLists,
} from '../crm/companies/cache';
import { contactKeys } from '../crm/contacts/keys';
import { taskKeys } from '../crm/tasks';
import { hubKeys } from './keys';
import { getQueryClient } from './queryClient';

type Kind = 'tasks' | 'contacts' | 'companies' | 'activities';

export function invalidateHub() {
  getQueryClient().invalidateQueries({ queryKey: hubKeys.all });
}

export function invalidateAfterTool(name: string, args: any, result?: any) {
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

  switch (tool) {
    case 'hub.create': {
      const { kind, data } = args as { kind: Kind; data: any };
      invLists(kind);
      if (kind === 'tasks' || kind === 'activities') {
        invalidateCompany(qc, data.companyId);
        invContact(data.contactId);
      }
      if (kind === 'contacts') invalidateCompany(qc, data.companyId);
      break;
    }
    case 'hub.update': {
      const { kind, id, patch } = args as {
        kind: Kind;
        id: string;
        patch: any;
      };
      const merged = { ...(result ?? {}), ...(patch ?? {}) };
      invLists(kind);
      if (kind === 'companies') invalidateCompany(qc, id);
      if (kind === 'contacts') {
        invContact(id);
        invalidateCompany(qc, merged.companyId);
      }
      if (kind === 'tasks' || kind === 'activities') {
        invalidateCompany(qc, merged.companyId);
        invContact(merged.contactId);
      }
      break;
    }
    case 'hub.delete': {
      const { kind, id } = args as { kind: Kind; id: string };
      invLists(kind);
      if (kind === 'companies') invalidateCompany(qc, id);
      if (kind === 'contacts') invContact(id);
      break;
    }
  }

  invalidateHub();
}
