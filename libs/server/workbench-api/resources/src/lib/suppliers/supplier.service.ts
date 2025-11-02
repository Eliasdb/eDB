import {
  supplierIdParamSchema,
  type SupplierRepo,
  type CreateSupplierBody,
  type UpdateSupplierBody,
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

export class SupplierService {
  constructor(private readonly repo: SupplierRepo) {}

  async list(_ctx: RequestContext, plan: PaginationPlan) {
    const { rows, total } = await this.repo.list({ plan });
    return makePaginatedResult(rows, plan, total);
  }

  async getOne(_ctx: RequestContext, id: string) {
    const { id: safe } = supplierIdParamSchema.parse({ id });
    const found = await this.repo.getById(safe);
    if (!found) throw new NotFoundError('Supplier not found');
    return { supplier: found };
  }

  async create(ctx: RequestContext, body: CreateSupplierBody) {
    ensureLoggedIn(ctx);
    const created = await this.repo.create(body);
    return { supplier: created };
  }

  async update(ctx: RequestContext, id: string, body: UpdateSupplierBody) {
    ensureLoggedIn(ctx);
    const { id: safe } = supplierIdParamSchema.parse({ id });
    const updated = await this.repo.update(safe, body);
    if (!updated) throw new NotFoundError('Supplier not found');
    return { supplier: updated };
  }

  async remove(ctx: RequestContext, id: string) {
    ensureLoggedIn(ctx);
    const { id: safe } = supplierIdParamSchema.parse({ id });
    const ok = await this.repo.delete(safe);
    if (!ok) throw new NotFoundError('Supplier not found');
    return { success: true as const };
  }
}
