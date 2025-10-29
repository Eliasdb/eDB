import type { PaginationPlan } from '@edb-workbench/api/shared';
import { z } from 'zod';

// ─────────────────────────────────────────────
// Schemas
// ─────────────────────────────────────────────

export const painterSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  style: z.string(),
  birthYear: z.number().optional(),
  isActive: z.boolean().optional(),
  status: z.enum(['active', 'archived']),
  joinedAt: z.string().datetime(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});
export type Painter = z.infer<typeof painterSchema>;

export const createPainterBodySchema = z.object({
  name: z.string(),
  style: z.string(),
  birthYear: z.number().optional(),
  isActive: z.boolean().optional(),
  status: z.enum(['active', 'archived']),
  joinedAt: z.string().datetime(),
});
export type CreatePainterBody = z.infer<typeof createPainterBodySchema>;

export const updatePainterBodySchema = z.object({
  name: z.string().optional(),
  style: z.string().optional(),
  birthYear: z.number().optional(),
  isActive: z.boolean().optional(),
  status: z.enum(['active', 'archived']).optional(),
  joinedAt: z.string().datetime().optional(),
});
export type UpdatePainterBody = z.infer<typeof updatePainterBodySchema>;

export const painterIdParamSchema = z.object({
  id: z.string().uuid(),
});
export type PainterIdParam = z.infer<typeof painterIdParamSchema>;

// ─────────────────────────────────────────────
// Repo interface (no relationships here)
// ─────────────────────────────────────────────

export interface PainterRepo {
  list(args: {
    plan: PaginationPlan;
    search?: string;
    filter?: Record<string, string>;
  }): Promise<{ rows: Painter[]; total: number }>;

  getById(id: string): Promise<Painter | undefined>;
  create(data: CreatePainterBody): Promise<Painter>;
  update(id: string, patch: UpdatePainterBody): Promise<Painter | undefined>;
  delete(id: string): Promise<boolean>;
}
