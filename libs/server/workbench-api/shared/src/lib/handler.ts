// libs/server/workbench-api/shared/src/lib/handler.ts

import type {
  FastifyInstance,
  FastifyReply,
  FastifyRequest,
  RouteHandlerMethod,
} from 'fastify';
import { toErrorResponse } from './errors';

/**
 * Wraps an async route impl with uniform try/catch + reply serialization.
 *
 * Usage in controller:
 *
 * app.get(
 *   '/demo-items',
 *   { preHandler: [requireAuth, validateRequest(...)] },
 *   handler(async (req, reply) => {
 *     const data = await service.listItems(ctxFromReq(req), req.query);
 *     return data; // we will reply.send(data)
 *   })
 * );
 */
export function handler<
  Req extends FastifyRequest = FastifyRequest,
  Res = unknown,
>(fn: (req: Req, reply: FastifyReply) => Promise<Res>): RouteHandlerMethod {
  // NOTE the `this: FastifyInstance | undefined` here. Fastify will bind `this`
  // to the server instance. Vitest won't. We allow both.
  return async function wrapped(
    this: FastifyInstance | undefined,
    req: FastifyRequest,
    reply: FastifyReply,
  ): Promise<void> {
    try {
      const data = await fn(req as Req, reply);
      reply.send(data);
    } catch (err: unknown) {
      const { statusCode, body } = toErrorResponse(err);
      reply.status(statusCode).send(body);
    }
  };
}
