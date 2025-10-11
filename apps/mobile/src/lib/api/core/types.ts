// ---- CRM ----
export type CompanyStage = 'lead' | 'prospect' | 'customer' | 'inactive';

export type CompanyHQ = {
  line1?: string | null;
  line2?: string | null;
  city?: string | null;
  region?: string | null;
  postalCode?: string | null;
  country?: string | null;
  // allow extra keys
  [k: string]: any;
};

export type Company = {
  id: string;
  name: string;

  // NEW fields coming from the backend
  website?: string | null; // full url, e.g. https://acme.com
  stage?: CompanyStage | null;
  industry?: string | null;
  description?: string | null;
  hq?: CompanyHQ | null;
  employees?: number | null;
  employeesRange?: string | null;
  ownerContactId?: string | null;
  primaryEmail?: string | null;
  phone?: string | null;

  // existing/legacy UI helpers
  domain?: string; // derive from website for display
  initials?: string;
  logoUrl?: string;
  source?: string;

  // optional meta (server returns these)
  createdAt?: string;
  updatedAt?: string;
};

export type Task = {
  id: string;
  title: string;
  due?: string;
  done?: boolean;
  source?: string;
  companyId?: string | null;
  contactId?: string | null;
};

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

export type Activity = {
  id: string;
  type: 'note' | 'call' | 'email' | 'meeting' | 'status' | 'system';
  at: string; // ISO
  summary: string;
  companyId?: string | null;
  contactId?: string | null;
};

export type HubPayload = {
  tasks: Task[];
  contacts: Contact[];
  companies: Company[];
  activities?: Activity[];
};

export type CompanyOverview = {
  company: Company; // now includes the new fields
  contacts: Contact[];
  activities: Activity[];
  tasks: Task[];
  stats: {
    lastActivityAt: string | null;
    nextTaskDue: string | null;
    openTasks: number;
  };
};

export type ContactOverview = {
  contact: Contact & { initials?: string };
  company?: Company & { initials?: string };
  activities: Activity[];
  stats: { lastActivityAt: string | null };
};
