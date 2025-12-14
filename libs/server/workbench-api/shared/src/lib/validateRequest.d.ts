import type { preHandlerHookHandler } from 'fastify';
export interface Schema<T> {
    parse(data: unknown): T;
}
export interface ValidateRequestOptions<Q, P, B> {
    querySchema?: Schema<Q>;
    paramsSchema?: Schema<P>;
    bodySchema?: Schema<B>;
}
/**
 * Fastify preHandler that:
 *  - parses req.query / req.params / req.body with Zod-like schemas
 *  - mutates req to the parsed (typed) values
 *  - on failure calls done(err) with BadRequestError
 *
 * This returns a real Fastify preHandlerHookHandler, so controllers can do:
 *
 *   app.get('/demo-items', {
 *     preHandler: [
 *       requireAuth,
 *       validateRequest<{page:number,...}, {}, {}>({ querySchema: listSchema })
 *     ]
 *   }, handler(...))
 */
export declare function validateRequest<Q = unknown, P = unknown, B = unknown>(opts: ValidateRequestOptions<Q, P, B>): preHandlerHookHandler;
