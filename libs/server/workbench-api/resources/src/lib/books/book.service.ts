// libs/server/workbench-api/resources/src/lib/books/book.service.ts
import {
  bookIdParamSchema,
  type BookRepo,
  type CreateBookBody,
  type UpdateBookBody,
} from '@edb-workbench/api/models';

import {
  NotFoundError,
  makePaginatedResult,
  type PaginationPlan,
} from '@edb-workbench/api/shared';

export type RequestContext = { userId: string | null; roles: string[] };

// if/when you flip this, the guards already exist
const REQUIRE_AUTH = false;
function ensureLoggedIn(ctx: RequestContext) {
  if (REQUIRE_AUTH && !ctx.userId) throw new Error('Login required');
}

export class BookService {
  constructor(private readonly repo: BookRepo) {}

  async listBooks(_ctx: RequestContext, plan: PaginationPlan) {
    const { rows, total } = await this.repo.list({ plan });
    return makePaginatedResult(rows, plan, total);
  }

  async getBook(_ctx: RequestContext, id: string) {
    const { id: safe } = bookIdParamSchema.parse({ id });
    const found = await this.repo.getById(safe);
    if (!found) throw new NotFoundError('Book not found');
    return { book: found };
  }

  async createBook(ctx: RequestContext, body: CreateBookBody) {
    ensureLoggedIn(ctx);
    // service can also parse if you prefer: const parsed = createBookBodySchema.parse(body)
    const created = await this.repo.create(body);
    return { book: created };
  }

  async updateBook(ctx: RequestContext, id: string, body: UpdateBookBody) {
    ensureLoggedIn(ctx);
    const { id: safe } = bookIdParamSchema.parse({ id });
    const updated = await this.repo.update(safe, body);
    if (!updated) throw new NotFoundError('Book not found');
    return { book: updated };
  }

  async deleteBook(ctx: RequestContext, id: string) {
    ensureLoggedIn(ctx);
    const { id: safe } = bookIdParamSchema.parse({ id });
    const ok = await this.repo.delete(safe);
    if (!ok) throw new NotFoundError('Book not found');
    return { success: true as const };
  }
}
