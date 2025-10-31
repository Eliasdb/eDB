// libs/server/workbench-api/shared/src/lib/validateRequest.ts

import type {
  FastifyInstance,
  FastifyReply,
  FastifyRequest,
  preHandlerHookHandler,
} from 'fastify';
import { ZodError } from 'zod';
import { BadRequestError } from './errors';

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
export function validateRequest<Q = unknown, P = unknown, B = unknown>(
  opts: ValidateRequestOptions<Q, P, B>,
): preHandlerHookHandler {
  const hook: preHandlerHookHandler = function preHandler(
    this: FastifyInstance, // Fastify binds this at runtime
    req: FastifyRequest,
    _reply: FastifyReply,
    done,
  ): void {
    try {
      if (opts.querySchema) {
        const parsedQuery = opts.querySchema.parse(req.query);
        (req as FastifyRequest & { query: Q }).query = parsedQuery;
      }

      if (opts.paramsSchema) {
        const parsedParams = opts.paramsSchema.parse(req.params);
        (req as FastifyRequest & { params: P }).params = parsedParams;
      }

      if (opts.bodySchema) {
        const parsedBody = opts.bodySchema.parse(req.body);
        (req as FastifyRequest & { body: B }).body = parsedBody;
      }

      done();
    } catch (_err) {
      done(new BadRequestError('Invalid request'));
      if (_err instanceof ZodError) {
        _reply.code(400).send({
          statusCode: 400,
          error: 'Bad Request',
          message: 'Invalid request',
          issues: _err.issues, // 👈 see exactly which field failed
        });
        return;
      }
    }
  };

  return hook;
}
