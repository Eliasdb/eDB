// apps/server/clara-api/src/domain/user.types.ts
import { z } from 'zod';

export const WorkSchema = z.object({
  company: z.string().min(1).optional(), // plain text label
  title: z.string().min(1).optional(), // role / title
  companyId: z.string().optional(), // optional link into CRM
});

export const UserSchema = z.object({
  id: z.string().min(1).optional(),
  // 🔹 Identity
  firstName: z.string().min(1).optional(),
  lastName: z.string().min(1).optional(),
  email: z.string().email(),
  phone: z.string().optional(), // keep as string; normalize later
  // 🔹 Preferences / meta
  role: z.enum(['owner', 'admin', 'member']).default('member'),
  locale: z.enum(['en', 'nl']).default('en'),
  avatarUrl: z.string().url().optional(),
  // 🔹 Work block
  work: WorkSchema.default({}),
});

export type User = z.infer<typeof UserSchema>;
export const UserPatchSchema = UserSchema.partial();
