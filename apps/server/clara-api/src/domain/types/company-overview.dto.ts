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
  activities: z.array(ActivitySchema),
  tasks: z.array(TaskSchema),
  stats: z.object({
    lastActivityAt: z.string().nullable(),
    nextTaskDue: z.string().nullable(),
    openTasks: z.number(),
  }),
});

export type CompanyOverviewDto = z.infer<typeof CompanyOverviewSchema>;
