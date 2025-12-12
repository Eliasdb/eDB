import {
  gadgetIdParamSchema,
  type GadgetRepo,
  type CreateGadgetBody,
  type UpdateGadgetBody,
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

export class GadgetService {
  constructor(private readonly repo: GadgetRepo) {}

  async list(_ctx: RequestContext, plan: PaginationPlan) {
    const { rows, total } = await this.repo.list({ plan });
    return makePaginatedResult(rows, plan, total);
  }

  async getOne(_ctx: RequestContext, id: string) {
    const { id: safe } = gadgetIdParamSchema.parse({ id });
    const found = await this.repo.getById(safe);
    if (!found) throw new NotFoundError('Gadget not found');
    return { gadget: found };
  }

  async create(ctx: RequestContext, body: CreateGadgetBody) {
    ensureLoggedIn(ctx);
    const created = await this.repo.create(body);
    return { gadget: created };
  }

  async update(ctx: RequestContext, id: string, body: UpdateGadgetBody) {
    ensureLoggedIn(ctx);
    const { id: safe } = gadgetIdParamSchema.parse({ id });
    const updated = await this.repo.update(safe, body);
    if (!updated) throw new NotFoundError('Gadget not found');
    return { gadget: updated };
  }

  async remove(ctx: RequestContext, id: string) {
    ensureLoggedIn(ctx);
    const { id: safe } = gadgetIdParamSchema.parse({ id });
    const ok = await this.repo.delete(safe);
    if (!ok) throw new NotFoundError('Gadget not found');
    return { success: true as const };
  }
}
