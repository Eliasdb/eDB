import type { PaginationPlan } from '@edb-workbench/api/shared';
import { z } from 'zod';
import type { Tag } from './tag.model';

// ─────────────────────────────────────────────
// Schemas
// ─────────────────────────────────────────────

// full Book row as exposed by API
export const bookSchema = z.object({
  id: z.string().uuid(),
  title: z.string(),
  publishedYear: z.number().int().optional(), // can be missing if draft
  status: z.enum(['draft', 'published', 'archived']).default('draft'),

  // relationship: belongs to Author
  authorId: z.string().uuid(),

  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export type Book = z.infer<typeof bookSchema>;

// body for POST /books
export const createBookBodySchema = z.object({
  title: z.string().min(1, 'title required'),
  publishedYear: z.number().int().optional(),
  status: z.enum(['draft', 'published', 'archived']).optional(),
  authorId: z.string().uuid(), // required: a Book must point to an Author
});

export type CreateBookBody = z.infer<typeof createBookBodySchema>;

// body for PATCH /books/:id
export const updateBookBodySchema = z.object({
  title: z.string().min(1).optional(),
  publishedYear: z.number().int().optional(),
  status: z.enum(['draft', 'published', 'archived']).optional(),
  authorId: z.string().uuid().optional(),
});

export type UpdateBookBody = z.infer<typeof updateBookBodySchema>;

// params for /books/:id
export const bookIdParamSchema = z.object({
  id: z.string().uuid(),
});
export type BookIdParam = z.infer<typeof bookIdParamSchema>;

// ─────────────────────────────────────────────
// Repo interface
// ─────────────────────────────────────────────

export interface BookRepo {
  list(args: {
    plan: PaginationPlan;
    search?: string;
    filter?: Record<string, string>;
  }): Promise<{ rows: Book[]; total: number }>;

  /**
   * convenience for "all books by this author" w/ same pagination contract
   */
  listByAuthor(args: {
    authorId: string;
    plan: PaginationPlan;
    search?: string;
    filter?: Record<string, string>;
  }): Promise<{ rows: Book[]; total: number }>;

  getById(id: string): Promise<Book | undefined>;

  create(data: CreateBookBody): Promise<Book>;

  update(id: string, patch: UpdateBookBody): Promise<Book | undefined>;

  delete(id: string): Promise<boolean>;

  /**
   * tags on a given book (uses the join table under the hood)
   */
  listTagsForBook(bookId: string): Promise<Tag[]>;
}
