// domain/types/company-overview.dto.ts
import { z } from 'zod';
import {
  ActivitySchema,
  CompanySchema,
  ContactSchema,
  TaskSchema,
} from '../types/crm.types';

export const ContactWithInitialsSchema = ContactSchema.extend({
  initials: z.string(),
});

export const CompanyOverviewSchema = z.object({
  company: CompanySchema,
  contacts: z.array(ContactWithInitialsSchema),

  // ✅ rename to avoid confusion with the Activities entity
  timeline: z.array(ActivitySchema),

  // (optional) temporary compat during migration; remove once clients switch
  activities: z.array(ActivitySchema).optional(),

  tasks: z.array(TaskSchema),
  stats: z.object({
    contactsCount: z.number(),
    lastActivityAt: z.string().nullable(), // overall (any activity for the company)
    lastContactActivityAt: z.string().nullable(), // 👈 only activities tied to company contacts
    nextTaskDue: z.string().nullable(),
    openTasks: z.number(),
  }),
});

export type CompanyOverviewDto = z.infer<typeof CompanyOverviewSchema>;
