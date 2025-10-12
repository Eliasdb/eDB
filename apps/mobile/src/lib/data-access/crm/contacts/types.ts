// data-access/crm/contacts/types.ts
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

export type Activity = {
  id: string;
  type: 'note' | 'call' | 'email' | 'meeting' | 'status' | 'system';
  at: string; // ISO
  summary: string;
  companyId?: string | null;
  contactId?: string | null;
};

export type ContactOverview = {
  contact: Contact & { initials?: string };
  company?: Company & { initials?: string };
  activities: Activity[];
  stats: { lastActivityAt: string | null };
};
