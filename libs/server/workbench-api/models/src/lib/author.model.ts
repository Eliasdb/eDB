import type { PaginationPlan } from '@edb-workbench/api/shared';
import { z } from 'zod';

// ─────────────────────────────────────────────
// Contract types (single source of truth)
// ─────────────────────────────────────────────

// Full Author shape exposed by the API.
export const authorSchema = z.object({
  id: z.string().uuid(),
  firstName: z.string(),
  lastName: z.string(),
  bio: z.string().optional(),
  isActive: z.boolean().default(true),

  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export type Author = z.infer<typeof authorSchema>;

// Body for POST /authors
export const createAuthorBodySchema = z.object({
  firstName: z.string().min(1, 'firstName required'),
  lastName: z.string().min(1, 'lastName required'),
  bio: z.string().optional(),
  isActive: z.boolean().optional(), // default true if omitted
});
export type CreateAuthorBody = z.infer<typeof createAuthorBodySchema>;

// Body for PATCH /authors/:id
export const updateAuthorBodySchema = z.object({
  firstName: z.string().min(1).optional(),
  lastName: z.string().min(1).optional(),
  bio: z.string().optional(),
  isActive: z.boolean().optional(),
});
export type UpdateAuthorBody = z.infer<typeof updateAuthorBodySchema>;

// URL param :id
export const authorIdParamSchema = z.object({
  id: z.string().uuid(),
});
export type AuthorIdParam = z.infer<typeof authorIdParamSchema>;

// ─────────────────────────────────────────────
// Repo interface
// ─────────────────────────────────────────────
//
// NOTE: this lives in models on purpose.
// - Resource layer depends on this.
// - Infra implements this.
//
// Infra does NOT get to redefine shapes.
// Infra adapts DB rows to these types.
//
export interface AuthorRepo {
  list(args: {
    plan: PaginationPlan;
    search?: string;
    filter?: Record<string, string>;
  }): Promise<{ rows: Author[]; total: number }>;

  getById(id: string): Promise<Author | undefined>;

  create(data: CreateAuthorBody): Promise<Author>;

  update(id: string, patch: UpdateAuthorBody): Promise<Author | undefined>;

  delete(id: string): Promise<boolean>;
}
