import type { PaginationPlan } from '@edb-workbench/api/shared';
import { z } from 'zod';

// ─────────────────────────────────────────────
// Schemas
// ─────────────────────────────────────────────

export const albumSchema = z.object({
  id: z.string().uuid(),
  title: z.string(),
  authorId: z.string().uuid(),
  status: z.enum(['draft', 'published', 'archived']),
  publishedYear: z.number().optional(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});
export type Album = z.infer<typeof albumSchema>;

export const createAlbumBodySchema = z.object({
  title: z.string(),
  authorId: z.string().uuid(),
  status: z.enum(['draft', 'published', 'archived']),
  publishedYear: z.number().optional(),
});
export type CreateAlbumBody = z.infer<typeof createAlbumBodySchema>;

export const updateAlbumBodySchema = z.object({
  title: z.string().optional(),
  authorId: z.string().uuid().optional(),
  status: z.enum(['draft', 'published', 'archived']).optional(),
  publishedYear: z.number().optional(),
});
export type UpdateAlbumBody = z.infer<typeof updateAlbumBodySchema>;

export const albumIdParamSchema = z.object({
  id: z.string().uuid(),
});
export type AlbumIdParam = z.infer<typeof albumIdParamSchema>;

// ─────────────────────────────────────────────
// Repo interface (no relationships here)
// ─────────────────────────────────────────────

export interface AlbumRepo {
  list(args: {
    plan: PaginationPlan;
    search?: string;
    filter?: Record<string, string>;
  }): Promise<{ rows: Album[]; total: number }>;

  getById(id: string): Promise<Album | undefined>;
  create(data: CreateAlbumBody): Promise<Album>;
  update(id: string, patch: UpdateAlbumBody): Promise<Album | undefined>;
  delete(id: string): Promise<boolean>;
}
