import type { PaginationPlan } from '@edb-workbench/api/shared';
import { z } from 'zod';
export declare const supplierSchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
    country: z.ZodOptional<z.ZodString>;
    rating: z.ZodOptional<z.ZodNumber>;
    contactEmail: z.ZodOptional<z.ZodString>;
    createdAt: z.ZodString;
    updatedAt: z.ZodString;
}, "strip", z.ZodTypeAny, {
    id: string;
    createdAt: string;
    updatedAt: string;
    name: string;
    country?: string | undefined;
    rating?: number | undefined;
    contactEmail?: string | undefined;
}, {
    id: string;
    createdAt: string;
    updatedAt: string;
    name: string;
    country?: string | undefined;
    rating?: number | undefined;
    contactEmail?: string | undefined;
}>;
export type Supplier = z.infer<typeof supplierSchema>;
export declare const createSupplierBodySchema: z.ZodObject<{
    name: z.ZodString;
    country: z.ZodOptional<z.ZodString>;
    rating: z.ZodOptional<z.ZodNumber>;
    contactEmail: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    name: string;
    country?: string | undefined;
    rating?: number | undefined;
    contactEmail?: string | undefined;
}, {
    name: string;
    country?: string | undefined;
    rating?: number | undefined;
    contactEmail?: string | undefined;
}>;
export type CreateSupplierBody = z.infer<typeof createSupplierBodySchema>;
export declare const updateSupplierBodySchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    country: z.ZodOptional<z.ZodString>;
    rating: z.ZodOptional<z.ZodNumber>;
    contactEmail: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    name?: string | undefined;
    country?: string | undefined;
    rating?: number | undefined;
    contactEmail?: string | undefined;
}, {
    name?: string | undefined;
    country?: string | undefined;
    rating?: number | undefined;
    contactEmail?: string | undefined;
}>;
export type UpdateSupplierBody = z.infer<typeof updateSupplierBodySchema>;
export declare const supplierIdParamSchema: z.ZodObject<{
    id: z.ZodString;
}, "strip", z.ZodTypeAny, {
    id: string;
}, {
    id: string;
}>;
export type SupplierIdParam = z.infer<typeof supplierIdParamSchema>;
export interface SupplierRepo {
    list(args: {
        plan: PaginationPlan;
        search?: string;
        filter?: Record<string, string>;
    }): Promise<{
        rows: Supplier[];
        total: number;
    }>;
    getById(id: string): Promise<Supplier | undefined>;
    create(data: CreateSupplierBody): Promise<Supplier>;
    update(id: string, patch: UpdateSupplierBody): Promise<Supplier | undefined>;
    delete(id: string): Promise<boolean>;
}
