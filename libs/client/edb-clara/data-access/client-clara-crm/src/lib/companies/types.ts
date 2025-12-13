/** Pipeline stage of a company in CRM. */
export type CompanyStage = 'lead' | 'prospect' | 'customer' | 'inactive';

/** Mailing/physical HQ address (flexible shape). */
export type CompanyHQ = {
  line1?: string | null;
  line2?: string | null;
  city?: string | null;
  region?: string | null;
  postalCode?: string | null;
  country?: string | null;
  /** Allow extra keys from enrichment, etc. */
  [k: string]: unknown;
};

/** Core Company record returned by the API. */
export type Company = {
  id: string;
  name: string;

  // Server data
  website?: string | null; // full URL, e.g. https://acme.com
  stage?: CompanyStage | null;
  industry?: string | null;
  description?: string | null;
  hq?: CompanyHQ | null;
  employees?: number | null;
  employeesRange?: string | null;
  ownerContactId?: string | null;
  primaryEmail?: string | null;
  phone?: string | null;

  // UI helpers / derived
  domain?: string; // derived from website
  initials?: string;
  logoUrl?: string;
  source?: string;

  // Metadata
  createdAt?: string;
  updatedAt?: string;
};

/** Payload for creating a company (server assigns id/timestamps). */
export type CreateCompanyInput = Omit<
  Company,
  'id' | 'createdAt' | 'updatedAt'
>;

/** Payload for patching a company (partial update). */
export type UpdateCompanyInput = Partial<CreateCompanyInput>;

/* ---------- Company overview DTOs (company-centric) ---------- */

/** Minimal shapes used inside a company's overview page. */
export type ContactSummary = {
  id: string;
  name: string;
  title?: string;
  email?: string;
  phone?: string;
  avatarUrl?: string;
  companyId?: string | null;

  /** Optional timestamps so UI can show "• 5m" safely */
  createdAt?: string;
  updatedAt?: string;
  /** If backend computes a per-contact last activity */
  lastActivityAt?: string | null;
};

export type TaskSummary = {
  id: string;
  title: string;
  due?: string;
  done?: boolean;
  companyId?: string | null;
  contactId?: string | null;
};

export type ActivitySummary = {
  id: string;
  type: 'note' | 'call' | 'email' | 'meeting' | 'status' | 'system';
  at: string; // ISO timestamp
  summary: string;
  companyId?: string | null;
  contactId?: string | null;
};

export type CompanyStats = {
  /** Latest activity across the whole company timeline */
  lastActivityAt: string | null;
  /** Latest "touch" related to contacts (created/updated/etc.) */
  lastContactActivityAt: string | null;
  /** Number of related contacts */
  contactsCount: number;
  /** Next upcoming task due date (if any) */
  nextTaskDue: string | null;
  /** Count of open (not done) tasks */
  openTasks: number;
};

/** Server response for the company overview endpoint. */
export type CompanyOverview = {
  company: Company;
  contacts: ContactSummary[];
  activities: ActivitySummary[]; // keep for compatibility with existing screens
  /** Optional: new canonical name if you adopt it */
  timeline?: ActivitySummary[];
  tasks: TaskSummary[];
  stats: CompanyStats;
};
