import {
  artistIdParamSchema,
  type ArtistRepo,
  type CreateArtistBody,
  type UpdateArtistBody,
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

export class ArtistService {
  constructor(private readonly repo: ArtistRepo) {}

  async list(_ctx: RequestContext, plan: PaginationPlan) {
    const { rows, total } = await this.repo.list({ plan });
    return makePaginatedResult(rows, plan, total);
  }

  async getOne(_ctx: RequestContext, id: string) {
    const { id: safe } = artistIdParamSchema.parse({ id });
    const found = await this.repo.getById(safe);
    if (!found) throw new NotFoundError('Artist not found');
    return { artist: found };
  }

  async create(ctx: RequestContext, body: CreateArtistBody) {
    ensureLoggedIn(ctx);
    const created = await this.repo.create(body);
    return { artist: created };
  }

  async update(ctx: RequestContext, id: string, body: UpdateArtistBody) {
    ensureLoggedIn(ctx);
    const { id: safe } = artistIdParamSchema.parse({ id });
    const updated = await this.repo.update(safe, body);
    if (!updated) throw new NotFoundError('Artist not found');
    return { artist: updated };
  }

  async remove(ctx: RequestContext, id: string) {
    ensureLoggedIn(ctx);
    const { id: safe } = artistIdParamSchema.parse({ id });
    const ok = await this.repo.delete(safe);
    if (!ok) throw new NotFoundError('Artist not found');
    return { success: true as const };
  }
}
