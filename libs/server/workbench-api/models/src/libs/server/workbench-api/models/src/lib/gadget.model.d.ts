import type { PaginationPlan } from '@edb-workbench/api/shared';
import { z } from 'zod';
export declare const gadgetSchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
    category: z.ZodEnum<["surveillance", "infiltration", "comms", "medical"]>;
    weightGr: z.ZodOptional<z.ZodNumber>;
    discontinued: z.ZodOptional<z.ZodBoolean>;
    releasedAt: z.ZodOptional<z.ZodString>;
    createdAt: z.ZodString;
    updatedAt: z.ZodString;
}, "strip", z.ZodTypeAny, {
    id: string;
    createdAt: string;
    updatedAt: string;
    name: string;
    category: "surveillance" | "infiltration" | "comms" | "medical";
    weightGr?: number | undefined;
    discontinued?: boolean | undefined;
    releasedAt?: string | undefined;
}, {
    id: string;
    createdAt: string;
    updatedAt: string;
    name: string;
    category: "surveillance" | "infiltration" | "comms" | "medical";
    weightGr?: number | undefined;
    discontinued?: boolean | undefined;
    releasedAt?: string | undefined;
}>;
export type Gadget = z.infer<typeof gadgetSchema>;
export declare const createGadgetBodySchema: z.ZodObject<{
    name: z.ZodString;
    category: z.ZodEnum<["surveillance", "infiltration", "comms", "medical"]>;
    weightGr: z.ZodOptional<z.ZodNumber>;
    discontinued: z.ZodOptional<z.ZodBoolean>;
    releasedAt: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    name: string;
    category: "surveillance" | "infiltration" | "comms" | "medical";
    weightGr?: number | undefined;
    discontinued?: boolean | undefined;
    releasedAt?: string | undefined;
}, {
    name: string;
    category: "surveillance" | "infiltration" | "comms" | "medical";
    weightGr?: number | undefined;
    discontinued?: boolean | undefined;
    releasedAt?: string | undefined;
}>;
export type CreateGadgetBody = z.infer<typeof createGadgetBodySchema>;
export declare const updateGadgetBodySchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    category: z.ZodOptional<z.ZodEnum<["surveillance", "infiltration", "comms", "medical"]>>;
    weightGr: z.ZodOptional<z.ZodNumber>;
    discontinued: z.ZodOptional<z.ZodBoolean>;
    releasedAt: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    name?: string | undefined;
    category?: "surveillance" | "infiltration" | "comms" | "medical" | undefined;
    weightGr?: number | undefined;
    discontinued?: boolean | undefined;
    releasedAt?: string | undefined;
}, {
    name?: string | undefined;
    category?: "surveillance" | "infiltration" | "comms" | "medical" | undefined;
    weightGr?: number | undefined;
    discontinued?: boolean | undefined;
    releasedAt?: string | undefined;
}>;
export type UpdateGadgetBody = z.infer<typeof updateGadgetBodySchema>;
export declare const gadgetIdParamSchema: z.ZodObject<{
    id: z.ZodString;
}, "strip", z.ZodTypeAny, {
    id: string;
}, {
    id: string;
}>;
export type GadgetIdParam = z.infer<typeof gadgetIdParamSchema>;
export interface GadgetRepo {
    list(args: {
        plan: PaginationPlan;
        search?: string;
        filter?: Record<string, string>;
    }): Promise<{
        rows: Gadget[];
        total: number;
    }>;
    getById(id: string): Promise<Gadget | undefined>;
    create(data: CreateGadgetBody): Promise<Gadget>;
    update(id: string, patch: UpdateGadgetBody): Promise<Gadget | undefined>;
    delete(id: string): Promise<boolean>;
}
