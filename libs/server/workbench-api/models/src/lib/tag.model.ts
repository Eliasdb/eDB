import type { PaginationPlan } from '@edb-workbench/api/shared';
import { z } from 'zod';

// ─────────────────────────────────────────────
// Schemas
// ─────────────────────────────────────────────

export const tagSchema = z.object({
  id: z.string().uuid(),
  label: z.string().min(1, 'label required'),

  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export type Tag = z.infer<typeof tagSchema>;

// POST /tags
export const createTagBodySchema = z.object({
  label: z.string().min(1, 'label required'),
});

export type CreateTagBody = z.infer<typeof createTagBodySchema>;

// PATCH /tags/:id
export const updateTagBodySchema = z.object({
  label: z.string().min(1).optional(),
});

export type UpdateTagBody = z.infer<typeof updateTagBodySchema>;

// params /tags/:id
export const tagIdParamSchema = z.object({
  id: z.string().uuid(),
});
export type TagIdParam = z.infer<typeof tagIdParamSchema>;

// ─────────────────────────────────────────────
// Repo interface
// ─────────────────────────────────────────────

export interface TagRepo {
  list(args: {
    plan: PaginationPlan;
    search?: string;
    filter?: Record<string, string>;
  }): Promise<{ rows: Tag[]; total: number }>;

  getById(id: string): Promise<Tag | undefined>;

  create(data: CreateTagBody): Promise<Tag>;

  update(id: string, patch: UpdateTagBody): Promise<Tag | undefined>;

  delete(id: string): Promise<boolean>;

  /**
   * For orchestration: which tags does this book have?
   * (backed by the join table)
   */
  listForBook(bookId: string): Promise<Tag[]>;
}
