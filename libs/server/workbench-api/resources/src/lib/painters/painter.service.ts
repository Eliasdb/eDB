import {
  painterIdParamSchema,
  type PainterRepo,
  type CreatePainterBody,
  type UpdatePainterBody,
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

export class PainterService {
  constructor(private readonly repo: PainterRepo) {}

  async list(_ctx: RequestContext, plan: PaginationPlan) {
    const { rows, total } = await this.repo.list({ plan });
    return makePaginatedResult(rows, plan, total);
  }

  async getOne(_ctx: RequestContext, id: string) {
    const { id: safe } = painterIdParamSchema.parse({ id });
    const found = await this.repo.getById(safe);
    if (!found) throw new NotFoundError('Painter not found');
    return { painter: found };
  }

  async create(ctx: RequestContext, body: CreatePainterBody) {
    ensureLoggedIn(ctx);
    const created = await this.repo.create(body);
    return { painter: created };
  }

  async update(ctx: RequestContext, id: string, body: UpdatePainterBody) {
    ensureLoggedIn(ctx);
    const { id: safe } = painterIdParamSchema.parse({ id });
    const updated = await this.repo.update(safe, body);
    if (!updated) throw new NotFoundError('Painter not found');
    return { painter: updated };
  }

  async remove(ctx: RequestContext, id: string) {
    ensureLoggedIn(ctx);
    const { id: safe } = painterIdParamSchema.parse({ id });
    const ok = await this.repo.delete(safe);
    if (!ok) throw new NotFoundError('Painter not found');
    return { success: true as const };
  }
}
