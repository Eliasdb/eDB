// data-access/crm/contacts/types.ts
import { Activity } from '../activities';
import type { Company } from '../companies/types';

export type Contact = {
  id: string;
  name: string;
  title?: string;
  email?: string;
  phone?: string;
  avatarUrl?: string;
  source?: string;
  companyId?: string | null;
};

export type CreateContactInput = Omit<Contact, 'id'>;
export type UpdateContactInput = Partial<CreateContactInput>;

export type ContactOverview = {
  contact: Contact & { initials?: string };
  company?: Company & { initials?: string };
  activities: Activity[];
  stats: { lastActivityAt: string | null };
};
