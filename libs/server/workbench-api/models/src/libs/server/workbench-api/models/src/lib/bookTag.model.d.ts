import { z } from 'zod';
export declare const bookTagSchema: z.ZodObject<{
    bookId: z.ZodString;
    tagId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    bookId: string;
    tagId: string;
}, {
    bookId: string;
    tagId: string;
}>;
export type BookTag = z.infer<typeof bookTagSchema>;
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
