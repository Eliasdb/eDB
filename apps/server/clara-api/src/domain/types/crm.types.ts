import z from 'zod';
import { toISOWithOffset } from '../../app/services/tools/modules/crm/datetime';

/* ========== Reusable pieces ========== */
export const PhoneSchema = z
  .string()
  .trim()
  // keep validation loose so international numbers pass; tighten later if needed
  .regex(/^[+()\-.\s0-9]{6,}$/u, 'invalid phone number')
  .optional()
  .nullable();

export const EmailSchema = z.string().email().optional().nullable();

export const AddressSchema = z
  .object({
    line1: z.string().trim().min(1).optional().nullable(),
    line2: z.string().trim().optional().nullable(),
    city: z.string().trim().optional().nullable(),
    region: z.string().trim().optional().nullable(), // state/province
    postalCode: z.string().trim().optional().nullable(),
    country: z.string().trim().optional().nullable(),
  })
  .optional()
  .nullable();

/** Use exact number if you have it; keep a range string for display/filtering */
export const EmployeeRangeEnum = z.enum([
  '1-10',
  '11-50',
  '51-200',
  '201-500',
  '501-1000',
  '1001-5000',
  '5000+',
]);

/* ========== Activity (timeline) ========== */
export const ActivitySchema = z.object({
  id: z.string().min(1).optional(),
  type: z.enum(['note', 'call', 'email', 'meeting', 'status', 'system']),
  at: z.preprocess(
    (v) => (typeof v === 'string' ? toISOWithOffset(v) : v),
    z.string().datetime({ offset: true }),
  ),
  summary: z.string().min(1),
  companyId: z.string().optional().nullable(), // <-- make nullable
  contactId: z.string().optional().nullable(), // <-- make nullable
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

/* ========== Company (now matches your cards) ========== */
export const CompanyStageEnum = z.enum([
  'lead',
  'prospect',
  'customer',
  'inactive',
]);

export const CompanySchema = z.object({
  id: z.string().min(1).optional(),

  // Basics
  name: z.string().min(1),
  stage: CompanyStageEnum.optional().nullable(),
  industry: z.string().optional().nullable(),
  description: z.string().optional().nullable(),

  // HQ
  hq: AddressSchema, // { line1, city, region, postalCode, country }

  // Employees
  employees: z.number().int().nonnegative().optional().nullable(),
  employeesRange: EmployeeRangeEnum.optional().nullable(),

  // Owner (link a Contact)
  ownerContactId: z.string().optional().nullable(),

  // Contacts (derived; keep optional list to allow write-through if you want)
  contactIds: z.array(z.string()).optional().nullable(),

  // Website / email / phone
  // website: z.string().url().optional().nullable(),
  website: z
    .string()
    .trim()
    .transform((v) => {
      if (!v) return v;
      return v.startsWith('http://') || v.startsWith('https://')
        ? v
        : `https://${v}`;
    })
    .pipe(z.string().url())
    .optional()
    .nullable(),
  primaryEmail: EmailSchema,
  phone: PhoneSchema,
});

export const CompanyPatchSchema = CompanySchema.omit({ id: true }).partial();
export type Company = z.infer<typeof CompanySchema>;
export type CompanyInput = z.input<typeof CompanySchema>;
export type CompanyPatch = z.infer<typeof CompanyPatchSchema>;

/* ========== Contact (list item) ========== */
// domain/types/crm.types (where ContactSchema lives)
export const ContactSchema = z.object({
  id: z.string().min(1).optional(),
  name: z.string().min(1),
  title: z.string().optional(),
  email: EmailSchema,
  phone: PhoneSchema,
  companyId: z.string().optional(),
  avatarUrl: z.string().url().optional(),

  // 👇 add these to match your drizzle schema
  createdAt: z.string().optional().nullable(),
  updatedAt: z.string().optional().nullable(),
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
