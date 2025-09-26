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

// apps/mobile/src/lib/api/types.ts
export type ChatTurn = { role: 'user' | 'assistant'; content: string };

export type ChatResponse = {
  reply: string; // <- what the server returns
  extraction?: {
    tasks: any[];
    contacts: any[];
    companies: any[];
  };
};
