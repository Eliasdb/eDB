import type { preHandlerHookHandler } from 'fastify';
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
export declare const optionalAuth: preHandlerHookHandler;
/**
 * requireAuth
 *
 * Fastify preHandler: ensures req.user.userId exists.
 * Calls done(err: Error) on failure.
 */
export declare const requireAuth: preHandlerHookHandler;
/**
 * requireRole('admin')
 *
 * Returns a Fastify preHandler: ensures ctx.roles includes that role.
 */
export declare function requireRole(role: string): preHandlerHookHandler;
/**
 * assertCanAccessResource(ctx, ownerId)
 *
 * Pure helper for services (not a Fastify hook).
 * Throws ForbiddenError if ctx.userId is neither owner nor allowed role.
 */
export declare function assertCanAccessResource(ctx: {
    userId: string | null;
    roles: string[];
}, resourceOwnerId: string, allowedRoles?: string[]): void;
