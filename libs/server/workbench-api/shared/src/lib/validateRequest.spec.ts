import type {
  FastifyInstance,
  FastifyReply,
  FastifyRequest,
} from 'fastify';
import { describe, expect, it, vi } from 'vitest';
import { z } from 'zod';
import { BadRequestError } from './errors';
import { validateRequest } from './validateRequest';

// tiny fake Fastify instance to satisfy `this: FastifyInstance`
function createFakeFastifyInstance(): FastifyInstance {
  return {} as FastifyInstance;
}

describe('validateRequest preHandler', () => {
  it('parses query / params / body and mutates req with typed values', () => {
    const querySchema = z.object({
      page: z.coerce.number().int(),
    });

    const paramsSchema = z.object({
      id: z.string().uuid(),
    });

    const bodySchema = z.object({
      name: z.string().min(1),
    });

    // pretend FastifyRequest
    const req: Partial<FastifyRequest> = {
      query: { page: '2' },
      params: { id: '550e8400-e29b-41d4-a716-446655440000' },
      body: { name: 'Test Item' },
    };

    const done = vi.fn();
    const fakeApp = createFakeFastifyInstance();
    const fakeReply = {} as FastifyReply;

    const preHandler = validateRequest({
      querySchema,
      paramsSchema,
      bodySchema,
    });

    // bind fake fastify instance as `this`
    preHandler.call(
      fakeApp,
      req as FastifyRequest,
      fakeReply,
      done,
    );

    // should have succeeded (no error passed to done)
    expect(done).toHaveBeenCalledWith();

    // req should now be parsed/typed
    expect(req.query).toEqual({ page: 2 });
    expect(req.params).toEqual({
      id: '550e8400-e29b-41d4-a716-446655440000',
    });
    expect(req.body).toEqual({ name: 'Test Item' });
  });

  it('calls done(err) with BadRequestError when validation fails', () => {
    const bodySchema = z.object({
      name: z.string().min(1),
    });

    const req: Partial<FastifyRequest> = {
      query: {},
      params: {},
      body: { name: '' }, // invalid
    };

    const done = vi.fn();
    const fakeApp = createFakeFastifyInstance();
    const fakeReply = {} as FastifyReply;

    const preHandler = validateRequest({
      bodySchema,
    });

    preHandler.call(
      fakeApp,
      req as FastifyRequest,
      fakeReply,
      done,
    );

    const firstArg = done.mock.calls[0][0];

    expect(firstArg).toBeInstanceOf(BadRequestError);
    expect(firstArg.message).toBe('Invalid request');
  });
});
