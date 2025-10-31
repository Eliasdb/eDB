import type { PaginationPlan } from '@edb-workbench/api/shared';
import { z } from 'zod';

// ─────────────────────────────────────────────
// Schemas
// ─────────────────────────────────────────────

export const missionSchema = z.object({
  id: z.string().uuid(),
  title: z.string(),
  status: z.enum(['planned', 'active', 'paused', 'completed', 'failed']),
  riskLevel: z.number().optional(),
  eta: z.string().datetime().optional(),
  agentId: z.string().uuid(),

  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});
export type Mission = z.infer<typeof missionSchema>;

export const createMissionBodySchema = z.object({
  title: z.string(),
  status: z.enum(['planned', 'active', 'paused', 'completed', 'failed']),
  riskLevel: z.number().optional(),
  eta: z.string().datetime().optional(),
  agentId: z.string().uuid(),
});
export type CreateMissionBody = z.infer<typeof createMissionBodySchema>;

export const updateMissionBodySchema = z.object({
  title: z.string().optional(),
  status: z
    .enum(['planned', 'active', 'paused', 'completed', 'failed'])
    .optional(),
  riskLevel: z.number().optional(),
  eta: z.string().datetime().optional(),
  agentId: z.string().uuid().optional(),
});
export type UpdateMissionBody = z.infer<typeof updateMissionBodySchema>;

export const missionIdParamSchema = z.object({
  id: z.string().uuid(),
});
export type MissionIdParam = z.infer<typeof missionIdParamSchema>;

// ─────────────────────────────────────────────
// Repo interface (no relationships here)
// ─────────────────────────────────────────────

export interface MissionRepo {
  list(args: {
    plan: PaginationPlan;
    search?: string;
    filter?: Record<string, string>;
  }): Promise<{ rows: Mission[]; total: number }>;

  getById(id: string): Promise<Mission | undefined>;
  create(data: CreateMissionBody): Promise<Mission>;
  update(id: string, patch: UpdateMissionBody): Promise<Mission | undefined>;
  delete(id: string): Promise<boolean>;
}
