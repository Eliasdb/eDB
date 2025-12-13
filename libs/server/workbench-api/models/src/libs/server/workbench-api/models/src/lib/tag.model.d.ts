import type { PaginationPlan } from '@edb-workbench/api/shared';
import { z } from 'zod';
export declare const tagSchema: z.ZodObject<{
    id: z.ZodString;
    label: z.ZodString;
    createdAt: z.ZodString;
    updatedAt: z.ZodString;
}, "strip", z.ZodTypeAny, {
    id: string;
    createdAt: string;
    updatedAt: string;
    label: string;
}, {
    id: string;
    createdAt: string;
    updatedAt: string;
    label: string;
}>;
export type Tag = z.infer<typeof tagSchema>;
export declare const createTagBodySchema: z.ZodObject<{
    label: z.ZodString;
}, "strip", z.ZodTypeAny, {
    label: string;
}, {
    label: string;
}>;
export type CreateTagBody = z.infer<typeof createTagBodySchema>;
export declare const updateTagBodySchema: z.ZodObject<{
    label: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    label?: string | undefined;
}, {
    label?: string | undefined;
}>;
export type UpdateTagBody = z.infer<typeof updateTagBodySchema>;
export declare const tagIdParamSchema: z.ZodObject<{
    id: z.ZodString;
}, "strip", z.ZodTypeAny, {
    id: string;
}, {
    id: string;
}>;
export type TagIdParam = z.infer<typeof tagIdParamSchema>;
export interface TagRepo {
    list(args: {
        plan: PaginationPlan;
        search?: string;
        filter?: Record<string, string>;
    }): Promise<{
        rows: Tag[];
        total: number;
    }>;
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
