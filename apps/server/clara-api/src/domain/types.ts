// types.ts
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

export type Kind = 'tasks' | 'contacts' | 'companies';
export type Model = { tasks: Task; contacts: Contact; companies: Company };
export type Patch = {
  tasks: Partial<Omit<Task, 'id'>>;
  contacts: Partial<Omit<Contact, 'id'>>;
  companies: Partial<Omit<Company, 'id'>>;
};

export type HubPayload = {
  tasks: Task[];
  contacts: Contact[];
  companies: Company[];
};

export type ChatTurn = {
  role: 'user' | 'assistant' | 'system';
  content: string;
};

export type Extraction = {
  tasks: Task[];
  contacts: Contact[];
  companies: Company[];
};
