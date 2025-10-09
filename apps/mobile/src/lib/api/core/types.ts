// core/types.ts

// ---- CRM ----
export type Task = {
  id: string;
  title: string;
  due?: string;
  done?: boolean;
  source?: string;
  companyId?: string;
  contactId?: string;
};

export type Contact = {
  id: string;
  name: string;
  title?: string;
  email?: string;
  phone?: string;
  avatarUrl?: string;
  source?: string;
  companyId?: string;
};

export type CompanyStage = 'lead' | 'prospect' | 'customer' | 'inactive';

export type Company = {
  id: string;
  name: string;
  domain?: string;
  initials?: string;
  logoUrl?: string;
  industry?: string; // optional: keeps old UI happy
  source?: string; // optional
  stage?: CompanyStage;
};

/** Server-aligned Activity (lean) */
export type Activity = {
  id: string;
  type: 'note' | 'call' | 'email' | 'meeting' | 'status' | 'system';
  at: string; // ISO timestamp
  summary: string;
  companyId?: string;
  contactId?: string;
};

export type HubPayload = {
  tasks: Task[];
  contacts: Contact[];
  companies: Company[];
  activities?: Activity[];
};

/** ✅ Overview payload for single-company screen */
export type CompanyOverview = {
  company: Company;
  contacts: Contact[];
  activities: Activity[];
  tasks: Task[];
  stats: {
    lastActivityAt: string | null;
    nextTaskDue: string | null;
    openTasks: number;
  };
};

// ---- Chat ----
export type ChatTurn = { role: 'user' | 'assistant'; content: string };

export type ChatResponse = {
  reply: string;
  extraction?: {
    tasks: any[];
    contacts: any[];
    companies: any[];
  };
};

// ---- Admin / tools ----
export type ToolLogEntry = {
  id: string;
  ts: number;
  name: string;
  durationMs: number;
  args?: unknown;
  result?: unknown;
  error?: string;
};

export type ToolLogsPayload = { items: ToolLogEntry[] };
