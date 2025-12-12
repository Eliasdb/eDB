import { z } from 'zod';

// ─────────────────────────────────────────────
// Schemas
// ─────────────────────────────────────────────

// join table row (Book ↔ Tag many-to-many)
export const bookTagSchema = z.object({
  bookId: z.string().uuid(),
  tagId: z.string().uuid(),
});

export type BookTag = z.infer<typeof bookTagSchema>;

// ─────────────────────────────────────────────
// Repo interface
// ─────────────────────────────────────────────

export interface BookTagRepo {
  /**
   * Attach a tag to a book (no return needed)
   */
  attachTagToBook(bookId: string, tagId: string): Promise<void>;

  /**
   * Remove a tag from a book
   */
  detachTagFromBook(bookId: string, tagId: string): Promise<void>;
}
