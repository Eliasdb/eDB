import type { PaginationPlan } from '@edb-workbench/api/shared';
import { z } from 'zod';

// ─────────────────────────────────────────────
// Schemas
// ─────────────────────────────────────────────

export const artistSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  country: z.string().optional(),
  status: z.enum(['active', 'archived']),
  formedAt: z.string().datetime().optional(),
  website: z.string().optional(),
  externalId: z.string().uuid().optional(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});
export type Artist = z.infer<typeof artistSchema>;

export const createArtistBodySchema = z.object({
  name: z.string(),
  country: z.string().optional(),
  status: z.enum(['active', 'archived']),
  formedAt: z.string().datetime().optional(),
  website: z.string().optional(),
  externalId: z.string().uuid().optional(),
});
export type CreateArtistBody = z.infer<typeof createArtistBodySchema>;

export const updateArtistBodySchema = z.object({
  name: z.string().optional(),
  country: z.string().optional(),
  status: z.enum(['active', 'archived']).optional(),
  formedAt: z.string().datetime().optional(),
  website: z.string().optional(),
  externalId: z.string().uuid().optional(),
});
export type UpdateArtistBody = z.infer<typeof updateArtistBodySchema>;

export const artistIdParamSchema = z.object({
  id: z.string().uuid(),
});
export type ArtistIdParam = z.infer<typeof artistIdParamSchema>;

// ─────────────────────────────────────────────
// Repo interface (no relationships here)
// ─────────────────────────────────────────────

export interface ArtistRepo {
  list(args: {
    plan: PaginationPlan;
    search?: string;
    filter?: Record<string, string>;
  }): Promise<{ rows: Artist[]; total: number }>;

  getById(id: string): Promise<Artist | undefined>;
  create(data: CreateArtistBody): Promise<Artist>;
  update(id: string, patch: UpdateArtistBody): Promise<Artist | undefined>;
  delete(id: string): Promise<boolean>;
}
