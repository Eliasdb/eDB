import {
  listQuerySchema,
  NotFoundError,
  type PaginatedResult,
} from '@edb-workbench/api/shared';
import { z } from 'zod';

/**
 * Domain model
 */
export const demoItemSchema = z.object({
  id: z.string().uuid(),
  title: z.string(),
  status: z.enum(['active', 'archived']).default('active'),
  ownerId: z.string().uuid(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export type DemoItem = z.infer<typeof demoItemSchema>;

/**
 * Create body
 */
export const createDemoItemBodySchema = z.object({
  title: z.string().min(1, 'title required'),
});
export type CreateDemoItemBody = z.infer<typeof createDemoItemBodySchema>;

/**
 * Update body
 */
export const updateDemoItemBodySchema = z.object({
  title: z.string().min(1, 'title required').optional(),
  status: z.enum(['active', 'archived']).optional(),
});
export type UpdateDemoItemBody = z.infer<typeof updateDemoItemBodySchema>;

/**
 * :id param
 */
export const idParamSchema = z.object({
  id: z.string().uuid(),
});
export type IdParam = z.infer<typeof idParamSchema>;

/**
 * List query
 * (page, pageSize, sort, filter) + optional free-text search
 */
export const listDemoItemsQuerySchema = listQuerySchema.extend({
  search: z.string().optional(),
});
export type ListDemoItemsQuery = z.infer<typeof listDemoItemsQuerySchema>;

/**
 * Response shapes
 */
export type DemoItemListResponse = PaginatedResult<DemoItem>;

export type DemoItemSingleResponse = {
  item: DemoItem;
};

/**
 * Helper for 404 in service layer
 */
export function ensureFound<T>(val: T | undefined, msg = 'Not Found'): T {
  if (!val) {
    throw new NotFoundError(msg);
  }
  return val;
}

// Re-export types for downstream
export type {
  PaginatedResult,
  PaginationPlan,
} from '@edb-workbench/api/shared';
