import {
  __singular__IdParamSchema,
  type __Cap__Repo,
  type Create__Cap__Body,
  type Update__Cap__Body,
} from '@edb-workbench/api/models';
import {
  makePaginatedResult,
  NotFoundError,
  type PaginationPlan,
} from '@edb-workbench/api/shared';

export type RequestContext = { userId: string | null; roles: string[] };
const REQUIRE_AUTH = false;

function ensureLoggedIn(ctx: RequestContext) {
  if (REQUIRE_AUTH && !ctx.userId) throw new Error('Login required');
}

export class __Cap__Service {
  constructor(private readonly repo: __Cap__Repo) {}

  async list(_ctx: RequestContext, plan: PaginationPlan) {
    const { rows, total } = await this.repo.list({ plan });
    return makePaginatedResult(rows, plan, total);
  }

  async getOne(_ctx: RequestContext, id: string) {
    const { id: safe } = __singular__IdParamSchema.parse({ id });
    const found = await this.repo.getById(safe);
    if (!found) throw new NotFoundError('__Cap__ not found');
    return { __singular__: found };
  }

  async create(ctx: RequestContext, body: Create__Cap__Body) {
    ensureLoggedIn(ctx);
    const created = await this.repo.create(body);
    return { __singular__: created };
  }

  async update(ctx: RequestContext, id: string, body: Update__Cap__Body) {
    ensureLoggedIn(ctx);
    const { id: safe } = __singular__IdParamSchema.parse({ id });
    const updated = await this.repo.update(safe, body);
    if (!updated) throw new NotFoundError('__Cap__ not found');
    return { __singular__: updated };
  }

  async remove(ctx: RequestContext, id: string) {
    ensureLoggedIn(ctx);
    const { id: safe } = __singular__IdParamSchema.parse({ id });
    const ok = await this.repo.delete(safe);
    if (!ok) throw new NotFoundError('__Cap__ not found');
    return { success: true as const };
  }
}
