import type { PaginationPlan } from '@edb-workbench/api/shared';
import { z } from 'zod';

// ─────────────────────────────────────────────
// Schemas
// ─────────────────────────────────────────────

export const supplierSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  country: z.string().optional(),
  rating: z.number().optional(),
  contactEmail: z.string().optional(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});
export type Supplier = z.infer<typeof supplierSchema>;

export const createSupplierBodySchema = z.object({
  name: z.string(),
  country: z.string().optional(),
  rating: z.number().optional(),
  contactEmail: z.string().optional(),
});
export type CreateSupplierBody = z.infer<typeof createSupplierBodySchema>;

export const updateSupplierBodySchema = z.object({
  name: z.string().optional(),
  country: z.string().optional(),
  rating: z.number().optional(),
  contactEmail: z.string().optional(),
});
export type UpdateSupplierBody = z.infer<typeof updateSupplierBodySchema>;

export const supplierIdParamSchema = z.object({
  id: z.string().uuid(),
});
export type SupplierIdParam = z.infer<typeof supplierIdParamSchema>;

// ─────────────────────────────────────────────
// Repo interface (no relationships here)
// ─────────────────────────────────────────────

export interface SupplierRepo {
  list(args: {
    plan: PaginationPlan;
    search?: string;
    filter?: Record<string, string>;
  }): Promise<{ rows: Supplier[]; total: number }>;

  getById(id: string): Promise<Supplier | undefined>;
  create(data: CreateSupplierBody): Promise<Supplier>;
  update(id: string, patch: UpdateSupplierBody): Promise<Supplier | undefined>;
  delete(id: string): Promise<boolean>;
}
