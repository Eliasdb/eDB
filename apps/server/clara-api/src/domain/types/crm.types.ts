import z from 'zod';

/* ========== Activity (timeline) ========== */
export const ActivitySchema = z.object({
  id: z.string().min(1).optional(),
  type: z.enum(['note', 'call', 'email', 'meeting', 'status', 'system']),
  at: z.string().datetime({ offset: true }), // ✅ allow +01:00, etc.
  summary: z.string().min(1),
  // link to either/both; optional to keep input flexible
  companyId: z.string().optional(),
  contactId: z.string().optional(),
});
export const ActivityPatchSchema = ActivitySchema.omit({ id: true }).partial();

export type Activity = z.infer<typeof ActivitySchema>;
export type ActivityInput = z.input<typeof ActivitySchema>;
export type ActivityPatch = z.infer<typeof ActivityPatchSchema>;

/* ========== Task (list with quick-complete) ========== */
export const TaskSchema = z.object({
  id: z.string().min(1).optional(),
  title: z.string().min(1),
  done: z.boolean().optional(),
  due: z.string().optional(),
  companyId: z.string().optional(),
  contactId: z.string().optional(),
});
export const TaskPatchSchema = TaskSchema.omit({ id: true }).partial();

export type Task = z.infer<typeof TaskSchema>;
export type TaskInput = z.input<typeof TaskSchema>;
export type TaskPatch = z.infer<typeof TaskPatchSchema>;

/* ========== Company (header + small pill) ========== */
export const CompanyStageEnum = z.enum([
  'lead',
  'prospect',
  'customer',
  'inactive',
]);

export const CompanySchema = z.object({
  id: z.string().min(1).optional(),
  name: z.string().min(1),
  website: z.string().url().optional().nullable(),
  stage: CompanyStageEnum.optional().nullable(),
});

export const CompanyPatchSchema = CompanySchema.omit({ id: true }).partial();
export type Company = z.infer<typeof CompanySchema>;
export type CompanyInput = z.input<typeof CompanySchema>;
export type CompanyPatch = z.infer<typeof CompanyPatchSchema>;

/* ========== Contact (list item) ========== */
export const ContactSchema = z.object({
  id: z.string().min(1).optional(),
  name: z.string().min(1),
  title: z.string().optional(),
  email: z.string().email().optional(),
  phone: z.string().optional().nullable(), // ✅ match DB column
  companyId: z.string().optional(),
  avatarUrl: z.string().url().optional(), // UI-only; not persisted today
});
export const ContactPatchSchema = ContactSchema.omit({ id: true }).partial();

export type Contact = z.infer<typeof ContactSchema>;
export type ContactInput = z.input<typeof ContactSchema>;
export type ContactPatch = z.infer<typeof ContactPatchSchema>;

/* ========== Shared ========== */
export const kindSchema = z.enum([
  'tasks',
  'contacts',
  'companies',
  'activities',
]);
export type Kind = z.infer<typeof kindSchema>;

export type Model = {
  tasks: Task;
  contacts: Contact;
  companies: Company;
  activities: Activity;
};

export type HubPayload = {
  tasks: Task[];
  contacts: Contact[];
  companies: Company[];
  activities: Activity[];
};

export type Patch = {
  tasks: TaskPatch;
  contacts: ContactPatch;
  companies: CompanyPatch;
  activities: ActivityPatch;
};

export type ChatTurn = {
  role: 'user' | 'assistant' | 'system';
  content: string;
};
export type Extraction = {
  tasks: Task[];
  contacts: Contact[];
  companies: Company[];
  activities: Activity[];
};

export const uid = (p: string) =>
  `${p}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`;

export const bodySchemaByKind: Record<Kind, z.ZodTypeAny> = {
  tasks: TaskSchema,
  contacts: ContactSchema,
  companies: CompanySchema,
  activities: ActivitySchema,
};
export const patchSchemaByKind: Record<Kind, z.ZodTypeAny> = {
  tasks: TaskPatchSchema,
  contacts: ContactPatchSchema,
  companies: CompanyPatchSchema,
  activities: ActivityPatchSchema,
};
