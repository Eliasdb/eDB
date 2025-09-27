// ---- CRM ----
export type Task = {
  id: string;
  title: string;
  due?: string;
  done?: boolean;
  source?: string;
};

export type Contact = {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  avatarUrl?: string;
  source?: string;
};

export type Company = {
  id: string;
  name: string;
  industry?: string;
  domain?: string;
  logoUrl?: string;
  source?: string;
};

export type HubPayload = {
  tasks: Task[];
  contacts: Contact[];
  companies: Company[];
};

// ---- chat ----

export type ChatTurn = { role: 'user' | 'assistant'; content: string };

export type ChatResponse = {
  reply: string;
  extraction?: {
    tasks: any[];
    contacts: any[];
    companies: any[];
  };
};

// ---- ADMIN / tools ----

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
