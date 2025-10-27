import type {
  FastifyReply,
  FastifyRequest,
  preHandlerHookHandler,
} from 'fastify';
import { ctxFromReq } from './context';
import { ForbiddenError, UnauthorizedError } from './errors';

// Small helper: normalize FastifyRequest -> our RequestContext
function getCtx(req: FastifyRequest) {
  return ctxFromReq(req);
}

/**
 * optionalAuth
 *
 * Fastify preHandler that NEVER blocks.
 * - If req.user is there, cool.
 * - If not, also fine.
 *
 * We still run ctxFromReq(req) later in handlers/services so downstream
 * code can read ctx.userId / ctx.roles, even if userId is null.
 *
 * This is what we want for "public / anonymous" routes.
 */
export const optionalAuth: preHandlerHookHandler = (
  _req: FastifyRequest,
  _reply: FastifyReply,
  done,
): void => {
  // do not reject anonymous requests
  done();
};

/**
 * requireAuth
 *
 * Fastify preHandler: ensures req.user.userId exists.
 * Calls done(err: Error) on failure.
 */
export const requireAuth: preHandlerHookHandler = (
  req: FastifyRequest,
  _reply: FastifyReply,
  done,
): void => {
  const ctx = getCtx(req);

  if (!ctx.userId) {
    done(new UnauthorizedError('Login required'));
    return;
  }

  done();
};

/**
 * requireRole('admin')
 *
 * Returns a Fastify preHandler: ensures ctx.roles includes that role.
 */
export function requireRole(role: string): preHandlerHookHandler {
  return (req: FastifyRequest, _reply: FastifyReply, done): void => {
    const ctx = getCtx(req);

    if (!ctx.roles.includes(role)) {
      done(new ForbiddenError('Forbidden'));
      return;
    }

    done();
  };
}

/**
 * assertCanAccessResource(ctx, ownerId)
 *
 * Pure helper for services (not a Fastify hook).
 * Throws ForbiddenError if ctx.userId is neither owner nor allowed role.
 */
export function assertCanAccessResource(
  ctx: { userId: string | null; roles: string[] },
  resourceOwnerId: string,
  allowedRoles: string[] = ['admin'],
): void {
  const isAdmin = ctx.roles.some((r) => allowedRoles.includes(r));
  const isOwner = ctx.userId !== null && ctx.userId === resourceOwnerId;

  if (!isAdmin && !isOwner) {
    throw new ForbiddenError('Not allowed to access this resource');
  }
}
