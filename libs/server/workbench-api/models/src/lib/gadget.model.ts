import type { PaginationPlan } from '@edb-workbench/api/shared';
import { z } from 'zod';

// ─────────────────────────────────────────────
// Schemas
// ─────────────────────────────────────────────

export const gadgetSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  category: z.enum(['surveillance', 'infiltration', 'comms', 'medical']),
  weightGr: z.number().optional(),
  discontinued: z.boolean().optional(),
  releasedAt: z.string().datetime().optional(),

  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});
export type Gadget = z.infer<typeof gadgetSchema>;

export const createGadgetBodySchema = z.object({
  name: z.string(),
  category: z.enum(['surveillance', 'infiltration', 'comms', 'medical']),
  weightGr: z.number().optional(),
  discontinued: z.boolean().optional(),
  releasedAt: z.string().datetime().optional(),
});
export type CreateGadgetBody = z.infer<typeof createGadgetBodySchema>;

export const updateGadgetBodySchema = z.object({
  name: z.string().optional(),
  category: z
    .enum(['surveillance', 'infiltration', 'comms', 'medical'])
    .optional(),
  weightGr: z.number().optional(),
  discontinued: z.boolean().optional(),
  releasedAt: z.string().datetime().optional(),
});
export type UpdateGadgetBody = z.infer<typeof updateGadgetBodySchema>;

export const gadgetIdParamSchema = z.object({
  id: z.string().uuid(),
});
export type GadgetIdParam = z.infer<typeof gadgetIdParamSchema>;

// ─────────────────────────────────────────────
// Repo interface (no relationships here)
// ─────────────────────────────────────────────

export interface GadgetRepo {
  list(args: {
    plan: PaginationPlan;
    search?: string;
    filter?: Record<string, string>;
  }): Promise<{ rows: Gadget[]; total: number }>;

  getById(id: string): Promise<Gadget | undefined>;
  create(data: CreateGadgetBody): Promise<Gadget>;
  update(id: string, patch: UpdateGadgetBody): Promise<Gadget | undefined>;
  delete(id: string): Promise<boolean>;
}
