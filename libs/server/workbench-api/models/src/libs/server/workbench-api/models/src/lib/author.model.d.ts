import type { PaginationPlan } from '@edb-workbench/api/shared';
import { z } from 'zod';
export declare const authorSchema: z.ZodObject<{
    id: z.ZodString;
    firstName: z.ZodString;
    lastName: z.ZodString;
    bio: z.ZodOptional<z.ZodString>;
    isActive: z.ZodDefault<z.ZodBoolean>;
    createdAt: z.ZodString;
    updatedAt: z.ZodString;
}, "strip", z.ZodTypeAny, {
    id: string;
    firstName: string;
    lastName: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
    bio?: string | undefined;
}, {
    id: string;
    firstName: string;
    lastName: string;
    createdAt: string;
    updatedAt: string;
    bio?: string | undefined;
    isActive?: boolean | undefined;
}>;
export type Author = z.infer<typeof authorSchema>;
export declare const createAuthorBodySchema: z.ZodObject<{
    firstName: z.ZodString;
    lastName: z.ZodString;
    bio: z.ZodOptional<z.ZodString>;
    isActive: z.ZodOptional<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    firstName: string;
    lastName: string;
    bio?: string | undefined;
    isActive?: boolean | undefined;
}, {
    firstName: string;
    lastName: string;
    bio?: string | undefined;
    isActive?: boolean | undefined;
}>;
export type CreateAuthorBody = z.infer<typeof createAuthorBodySchema>;
export declare const updateAuthorBodySchema: z.ZodObject<{
    firstName: z.ZodOptional<z.ZodString>;
    lastName: z.ZodOptional<z.ZodString>;
    bio: z.ZodOptional<z.ZodString>;
    isActive: z.ZodOptional<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    firstName?: string | undefined;
    lastName?: string | undefined;
    bio?: string | undefined;
    isActive?: boolean | undefined;
}, {
    firstName?: string | undefined;
    lastName?: string | undefined;
    bio?: string | undefined;
    isActive?: boolean | undefined;
}>;
export type UpdateAuthorBody = z.infer<typeof updateAuthorBodySchema>;
export declare const authorIdParamSchema: z.ZodObject<{
    id: z.ZodString;
}, "strip", z.ZodTypeAny, {
    id: string;
}, {
    id: string;
}>;
export type AuthorIdParam = z.infer<typeof authorIdParamSchema>;
export interface AuthorRepo {
    list(args: {
        plan: PaginationPlan;
        search?: string;
        filter?: Record<string, string>;
    }): Promise<{
        rows: Author[];
        total: number;
    }>;
    getById(id: string): Promise<Author | undefined>;
    create(data: CreateAuthorBody): Promise<Author>;
    update(id: string, patch: UpdateAuthorBody): Promise<Author | undefined>;
    delete(id: string): Promise<boolean>;
}
