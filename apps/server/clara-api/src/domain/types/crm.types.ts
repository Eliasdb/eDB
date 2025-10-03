import z from 'zod';

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

export type Kind = z.infer<typeof kindSchema>;

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

// ---- Schemas ---------------------------------------------------------------

export const TaskSchema = z.object({
  id: z.string().min(1).optional(), // server will add if missing
  title: z.string().min(1),
  due: z.string().optional(),
  done: z.boolean().optional(),
  source: z.string().optional(),
});

export const ContactSchema = z.object({
  id: z.string().min(1).optional(),
  name: z.string().min(1),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  avatarUrl: z.string().url().optional(),
  source: z.string().optional(),
});

export const CompanySchema = z.object({
  id: z.string().min(1).optional(),
  name: z.string().min(1),
  industry: z.string().optional(),
  domain: z.string().optional(),
  logoUrl: z.string().url().optional(),
  source: z.string().optional(),
});

// Type discriminator
export const kindSchema = z.enum(['tasks', 'contacts', 'companies']);

// Small id helper (no extra deps)
export const uid = (p: string) =>
  `${p}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`;

// Per-kind schema helpers
export const bodySchemaByKind: Record<Kind, z.ZodTypeAny> = {
  tasks: TaskSchema,
  contacts: ContactSchema,
  companies: CompanySchema,
};

// Patch schemas (all optional)
export const patchSchemaByKind: Record<Kind, z.ZodTypeAny> = {
  tasks: TaskSchema.partial(),
  contacts: ContactSchema.partial(),
  companies: CompanySchema.partial(),
};
