import z from 'zod';

/* ========== Activity ========== */
export const ActivitySchema = z.object({
  id: z.string().min(1).optional(),
  contactId: z.string().min(1), // 👈 normalize relationship
  type: z.enum([
    'note',
    'call',
    'email',
    'meeting',
    'task',
    'status',
    'system',
  ]),
  at: z.string().datetime(),
  by: z.string().optional(),
  summary: z.string().min(1),
  payload: z
    .object({
      durationMin: z.number().optional(),
      outcome: z.string().optional(),
      followUpAt: z.string().datetime().optional(),
      attachments: z
        .array(z.object({ name: z.string(), url: z.string().url() }))
        .optional(),
    })
    .optional(),
});
export const ActivityPatchSchema = ActivitySchema.omit({ id: true }).partial();

export type Activity = z.infer<typeof ActivitySchema>;
export type ActivityInput = z.input<typeof ActivitySchema>;
export type ActivityPatch = z.infer<typeof ActivityPatchSchema>;

/* ========== Task ========== */
export const TaskSchema = z.object({
  id: z.string().min(1).optional(),
  title: z.string().min(1),
  due: z.string().optional(),
  done: z.boolean().optional(),
  source: z.string().optional(),
});
export const TaskPatchSchema = TaskSchema.omit({ id: true }).partial();

export type Task = z.infer<typeof TaskSchema>;
export type TaskInput = z.input<typeof TaskSchema>;
export type TaskPatch = z.infer<typeof TaskPatchSchema>;

/* ========== Company ========== */
export const CompanySchema = z.object({
  id: z.string().min(1).optional(),
  name: z.string().min(1),
  industry: z.string().optional(),
  domain: z.string().optional(),
  logoUrl: z.string().url().optional(),
  source: z.string().optional(),
});
export const CompanyPatchSchema = CompanySchema.omit({ id: true }).partial();

export type Company = z.infer<typeof CompanySchema>;
export type CompanyInput = z.input<typeof CompanySchema>;
export type CompanyPatch = z.infer<typeof CompanyPatchSchema>;

/* ========== Contact ========== */
export const ContactSchema = z.object({
  id: z.string().min(1).optional(),
  name: z.string().min(1),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  avatarUrl: z.string().url().optional(),
  source: z.string().optional(),
  // ❌ remove embedded activities to avoid duplication
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
]); // 👈 add activities
export type Kind = z.infer<typeof kindSchema>;

export type Model = {
  tasks: Task;
  contacts: Contact;
  companies: Company;
  activities: Activity; // 👈 new
};

export type HubPayload = {
  tasks: Task[];
  contacts: Contact[];
  companies: Company[];
  activities: Activity[]; // 👈 new
};

export type Patch = {
  tasks: TaskPatch;
  contacts: ContactPatch;
  companies: CompanyPatch;
  activities: ActivityPatch; // 👈 new
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
  activities: ActivitySchema, // 👈
};
export const patchSchemaByKind: Record<Kind, z.ZodTypeAny> = {
  tasks: TaskPatchSchema,
  contacts: ContactPatchSchema,
  companies: CompanyPatchSchema,
  activities: ActivityPatchSchema, // 👈
};
