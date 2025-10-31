import {
  missionIdParamSchema,
  type MissionRepo,
  type CreateMissionBody,
  type UpdateMissionBody,
} from '@edb-workbench/api/models';
import {
  NotFoundError,
  makePaginatedResult,
  type PaginationPlan,
} from '@edb-workbench/api/shared';

export type RequestContext = { userId: string | null; roles: string[] };
const REQUIRE_AUTH = false;
function ensureLoggedIn(ctx: RequestContext) {
  if (REQUIRE_AUTH && !ctx.userId) throw new Error('Login required');
}

export class MissionService {
  constructor(private readonly repo: MissionRepo) {}

  async list(_ctx: RequestContext, plan: PaginationPlan) {
    const { rows, total } = await this.repo.list({ plan });
    return makePaginatedResult(rows, plan, total);
  }

  async getOne(_ctx: RequestContext, id: string) {
    const { id: safe } = missionIdParamSchema.parse({ id });
    const found = await this.repo.getById(safe);
    if (!found) throw new NotFoundError('Mission not found');
    return { mission: found };
  }

  async create(ctx: RequestContext, body: CreateMissionBody) {
    ensureLoggedIn(ctx);
    const created = await this.repo.create(body);
    return { mission: created };
  }

  async update(ctx: RequestContext, id: string, body: UpdateMissionBody) {
    ensureLoggedIn(ctx);
    const { id: safe } = missionIdParamSchema.parse({ id });
    const updated = await this.repo.update(safe, body);
    if (!updated) throw new NotFoundError('Mission not found');
    return { mission: updated };
  }

  async remove(ctx: RequestContext, id: string) {
    ensureLoggedIn(ctx);
    const { id: safe } = missionIdParamSchema.parse({ id });
    const ok = await this.repo.delete(safe);
    if (!ok) throw new NotFoundError('Mission not found');
    return { success: true as const };
  }
}
