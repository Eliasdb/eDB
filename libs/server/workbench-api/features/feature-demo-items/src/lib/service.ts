import {
  NotFoundError,
  UnauthorizedError,
  assertCanAccessResource,
  buildPagination,
  makePaginatedResult,
} from '@edb-workbench/api/shared';

import {
  ensureFound,
  type CreateDemoItemBody,
  type DemoItemListResponse,
  type DemoItemSingleResponse,
  type ListDemoItemsQuery,
  type UpdateDemoItemBody,
} from './contracts';

import {
  createDemoItemRepo,
  deleteDemoItemRepo,
  getDemoItemByIdRepo,
  listDemoItemsRepo,
  updateDemoItemRepo,
} from './repo';

/**
 * Feature-level security switch.
 *
 * false  = "demo / scaffold mode"
 *         - reads are public
 *         - writes also skip auth (so you can POST from curl with no user)
 *
 * true   = "real mode"
 *         - reads can enforce ownership/admin
 *         - writes require logged-in user and ownership
 *
 * We start with false so we can iterate fast.
 * When we're ready for RBAC/tenancy, set true and commit.
 */
const REQUIRE_AUTH = false;

export type RequestContext = {
  userId: string | null;
  roles: string[];
};

// internal helper to check login depending on REQUIRE_AUTH
function ensureLoggedIn(
  ctx: RequestContext,
): asserts ctx is RequestContext & { userId: string } {
  if (REQUIRE_AUTH && !ctx.userId) {
    throw new UnauthorizedError('Login required');
  }
}

/**
 * LIST
 *
 * Demo rules:
 * - If REQUIRE_AUTH === false:
 *   return everything with pagination/sort/filter
 *
 * - If REQUIRE_AUTH === true:
 *   only admins see all
 *   normal users only see their own rows
 */
export function listItems(
  ctx: RequestContext,
  query: ListDemoItemsQuery,
): DemoItemListResponse {
  const plan = buildPagination(query);

  const { rows, total } = listDemoItemsRepo({
    plan,
    search: query.search,
  });

  if (!REQUIRE_AUTH) {
    // wide open for now
    return makePaginatedResult(rows, plan, total);
  }

  // "real mode": user must exist, then scope visibility
  ensureLoggedIn(ctx);

  const isAdmin = ctx.roles.includes('admin');
  const visibleRows = isAdmin
    ? rows
    : rows.filter((item) => item.ownerId === ctx.userId);

  const visibleTotal = isAdmin ? total : visibleRows.length;

  return makePaginatedResult(visibleRows, plan, visibleTotal);
}

/**
 * GET ONE
 *
 * Demo mode (REQUIRE_AUTH === false): anyone can read.
 * Real mode: only owner/admin.
 */
export function getItem(
  ctx: RequestContext,
  id: string,
): DemoItemSingleResponse {
  const item = ensureFound(getDemoItemByIdRepo(id));

  if (!REQUIRE_AUTH) {
    return { item };
  }

  ensureLoggedIn(ctx);
  assertCanAccessResource(ctx, item.ownerId, ['admin']);
  return { item };
}

/**
 * CREATE
 *
 * Demo mode:
 *   - if REQUIRE_AUTH === false, we fake an owner so you can create from curl.
 * Real mode:
 *   - you must be logged in, and we use your ctx.userId.
 */
export function createItem(
  ctx: RequestContext,
  body: CreateDemoItemBody,
): DemoItemSingleResponse {
  if (!REQUIRE_AUTH) {
    // No auth required in scaffold mode → pretend it's owned by "demo-user"
    const created = createDemoItemRepo(ctx.userId ?? 'demo-user', body.title);
    return { item: created };
  }

  // real mode: enforce login
  ensureLoggedIn(ctx);
  const created = createDemoItemRepo(ctx.userId, body.title);
  return { item: created };
}

/**
 * UPDATE
 *
 * Demo mode:
 *   - REQUIRE_AUTH === false → anyone can PATCH anything
 * Real mode:
 *   - require login AND owner/admin
 */
export function updateItem(
  ctx: RequestContext,
  id: string,
  body: UpdateDemoItemBody,
): DemoItemSingleResponse {
  const existing = ensureFound(getDemoItemByIdRepo(id));

  if (!REQUIRE_AUTH) {
    const updated = updateDemoItemRepo(id, body);
    const finalItem = ensureFound(updated, 'Updated item missing');
    return { item: finalItem };
  }

  ensureLoggedIn(ctx);
  assertCanAccessResource(ctx, existing.ownerId, ['admin']);

  const updated = updateDemoItemRepo(id, body);
  const finalItem = ensureFound(updated, 'Updated item missing');
  return { item: finalItem };
}

/**
 * DELETE
 *
 * Demo mode:
 *   - REQUIRE_AUTH === false → anyone can delete
 * Real mode:
 *   - require login AND owner/admin
 */
export function deleteItem(ctx: RequestContext, id: string): { success: true } {
  const existing = ensureFound(getDemoItemByIdRepo(id));

  if (!REQUIRE_AUTH) {
    const ok = deleteDemoItemRepo(id);
    if (!ok) {
      throw new NotFoundError('Item already gone');
    }
    return { success: true };
  }

  ensureLoggedIn(ctx);
  assertCanAccessResource(ctx, existing.ownerId, ['admin']);

  const ok = deleteDemoItemRepo(id);
  if (!ok) {
    throw new NotFoundError('Item already gone');
  }

  return { success: true };
}
