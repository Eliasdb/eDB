import type { FastifyReply, FastifyRequest, RouteHandlerMethod } from 'fastify';
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
export declare function handler<Req extends FastifyRequest = FastifyRequest, Res = unknown>(fn: (req: Req, reply: FastifyReply) => Promise<Res>): RouteHandlerMethod;
