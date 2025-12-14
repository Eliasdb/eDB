import type { PaginationPlan } from '@edb-workbench/api/shared';
import { z } from 'zod';
import type { Tag } from './tag.model';
export declare const bookSchema: z.ZodObject<{
    id: z.ZodString;
    title: z.ZodString;
    publishedYear: z.ZodOptional<z.ZodNumber>;
    status: z.ZodDefault<z.ZodEnum<["draft", "published", "archived"]>>;
    authorId: z.ZodString;
    createdAt: z.ZodString;
    updatedAt: z.ZodString;
}, "strip", z.ZodTypeAny, {
    id: string;
    createdAt: string;
    updatedAt: string;
    status: "draft" | "published" | "archived";
    title: string;
    authorId: string;
    publishedYear?: number | undefined;
}, {
    id: string;
    createdAt: string;
    updatedAt: string;
    title: string;
    authorId: string;
    status?: "draft" | "published" | "archived" | undefined;
    publishedYear?: number | undefined;
}>;
export type Book = z.infer<typeof bookSchema>;
export declare const createBookBodySchema: z.ZodObject<{
    title: z.ZodString;
    publishedYear: z.ZodOptional<z.ZodNumber>;
    status: z.ZodOptional<z.ZodEnum<["draft", "published", "archived"]>>;
    authorId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    title: string;
    authorId: string;
    status?: "draft" | "published" | "archived" | undefined;
    publishedYear?: number | undefined;
}, {
    title: string;
    authorId: string;
    status?: "draft" | "published" | "archived" | undefined;
    publishedYear?: number | undefined;
}>;
export type CreateBookBody = z.infer<typeof createBookBodySchema>;
export declare const updateBookBodySchema: z.ZodObject<{
    title: z.ZodOptional<z.ZodString>;
    publishedYear: z.ZodOptional<z.ZodNumber>;
    status: z.ZodOptional<z.ZodEnum<["draft", "published", "archived"]>>;
    authorId: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    status?: "draft" | "published" | "archived" | undefined;
    title?: string | undefined;
    publishedYear?: number | undefined;
    authorId?: string | undefined;
}, {
    status?: "draft" | "published" | "archived" | undefined;
    title?: string | undefined;
    publishedYear?: number | undefined;
    authorId?: string | undefined;
}>;
export type UpdateBookBody = z.infer<typeof updateBookBodySchema>;
export declare const bookIdParamSchema: z.ZodObject<{
    id: z.ZodString;
}, "strip", z.ZodTypeAny, {
    id: string;
}, {
    id: string;
}>;
export type BookIdParam = z.infer<typeof bookIdParamSchema>;
export interface BookRepo {
    list(args: {
        plan: PaginationPlan;
        search?: string;
        filter?: Record<string, string>;
    }): Promise<{
        rows: Book[];
        total: number;
    }>;
    /**
     * convenience for "all books by this author" w/ same pagination contract
     */
    listByAuthor(args: {
        authorId: string;
        plan: PaginationPlan;
        search?: string;
        filter?: Record<string, string>;
    }): Promise<{
        rows: Book[];
        total: number;
    }>;
    getById(id: string): Promise<Book | undefined>;
    create(data: CreateBookBody): Promise<Book>;
    update(id: string, patch: UpdateBookBody): Promise<Book | undefined>;
    delete(id: string): Promise<boolean>;
    /**
     * tags on a given book (uses the join table under the hood)
     */
    listTagsForBook(bookId: string): Promise<Tag[]>;
}
