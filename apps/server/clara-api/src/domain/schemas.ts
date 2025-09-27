// apps/server/clara-api/src/domain/schemas.ts
import { z } from 'zod';

export const kind = z.enum(['tasks', 'contacts', 'companies']);
export type Kind = z.infer<typeof kind>;

export const task = z.object({
  id: z.string().min(1).optional(),
  title: z.string().min(1),
  due: z.string().optional(),
  done: z.boolean().optional(),
  source: z.string().optional(),
});

export const contact = z.object({
  id: z.string().min(1).optional(),
  name: z.string().min(1),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  avatarUrl: z.string().url().optional(),
  source: z.string().optional(),
});

export const company = z.object({
  id: z.string().min(1).optional(),
  name: z.string().min(1),
  industry: z.string().optional(),
  domain: z.string().optional(),
  logoUrl: z.string().url().optional(),
  source: z.string().optional(),
});

export const byKind: Record<Kind, z.ZodTypeAny> = {
  tasks: task,
  contacts: contact,
  companies: company,
};
export const patchByKind: Record<Kind, z.ZodTypeAny> = {
  tasks: task.partial(),
  contacts: contact.partial(),
  companies: company.partial(),
};
