/* libs/shared-types/src/lib/crm.types.ts
   -------------------------------------------------------------- */
export type ContactStatus = 'Lead' | 'Customer' | 'Prospect' | 'Archived';

export interface ActivityItem {
  date: string; // ISO date string
  title: string;
  text?: string;
}

export interface Contact {
  /* ── Core ── */
  id?: string; // optional for “new” contacts
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;

  companyId?: string;
  companyName?: string;
  status?: ContactStatus;

  /* ── Extras ── */
  tags?: string[];
  activity?: ActivityItem[];

  /* Derived helper (not persisted) */
  /** Convenience getter so templates can use {{contact.fullName}} */
  fullName?: string; // filled client-side: `${first} ${last}`
}

export interface CompanyDto {
  id: string;
  name: string;
  vatNumber?: string;
  website?: string;
}

export interface ContactDto {
  id: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;

  companyId: string;
  companyName: string;
  status: 'Lead' | 'Prospect' | 'Customer' | 'Inactive' | 'Archived';

  createdAt?: string;
  updatedAt?: string;
}
