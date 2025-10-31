import type { PaginationPlan } from '@edb-workbench/api/shared';
import { z } from 'zod';

// ─────────────────────────────────────────────
// Schemas
// ─────────────────────────────────────────────

export const agentSchema = z.object({
  id: z.string().uuid(),
  codename: z.string(),
  status: z.enum(['active', 'inactive', 'retired']),
  clearance: z.number().optional(),
  specialty: z.string().optional(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});
export type Agent = z.infer<typeof agentSchema>;

export const createAgentBodySchema = z.object({
  codename: z.string(),
  status: z.enum(['active', 'inactive', 'retired']),
  clearance: z.number().optional(),
  specialty: z.string().optional(),
});
export type CreateAgentBody = z.infer<typeof createAgentBodySchema>;

export const updateAgentBodySchema = z.object({
  codename: z.string().optional(),
  status: z.enum(['active', 'inactive', 'retired']).optional(),
  clearance: z.number().optional(),
  specialty: z.string().optional(),
});
export type UpdateAgentBody = z.infer<typeof updateAgentBodySchema>;

export const agentIdParamSchema = z.object({
  id: z.string().uuid(),
});
export type AgentIdParam = z.infer<typeof agentIdParamSchema>;

// ─────────────────────────────────────────────
// Repo interface (no relationships here)
// ─────────────────────────────────────────────

export interface AgentRepo {
  list(args: {
    plan: PaginationPlan;
    search?: string;
    filter?: Record<string, string>;
  }): Promise<{ rows: Agent[]; total: number }>;

  getById(id: string): Promise<Agent | undefined>;
  create(data: CreateAgentBody): Promise<Agent>;
  update(id: string, patch: UpdateAgentBody): Promise<Agent | undefined>;
  delete(id: string): Promise<boolean>;
}
