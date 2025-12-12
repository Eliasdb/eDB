// auth.test-utils.ts
import type { FastifyInstance, preHandlerHookHandler } from 'fastify';
import { requireAuth, requireRole } from './auth';

// super-minimal fake Fastify instance for binding `this`.
// we don't need any real methods on it for these tests.
function createFakeFastifyInstance(): FastifyInstance {
  return {} as FastifyInstance;
}

/**
 * Call a Fastify-style preHandler hook with:
 * - fake Fastify `this`
 * - our mock req
 * - fake reply
 * - done(err)
 *
 * If done(err) got an error, we throw it so tests can do
 * expect(() => runHook...).toThrow(...)
 */
function runHookAndThrowOnError(
  hook: preHandlerHookHandler,
  reqLike: unknown,
): void {
  let capturedErr: unknown = undefined;

  const fakeReply = {} as any;
  const fakeApp = createFakeFastifyInstance();

  hook.call(fakeApp, reqLike as any, fakeReply, (err?: Error) => {
    capturedErr = err;
  });

  if (capturedErr) {
    throw capturedErr;
  }
}

export function requireAuthForTest(reqLike: unknown): void {
  runHookAndThrowOnError(requireAuth, reqLike);
}

export function requireRoleForTest(role: string, reqLike: unknown): void {
  runHookAndThrowOnError(requireRole(role), reqLike);
}
