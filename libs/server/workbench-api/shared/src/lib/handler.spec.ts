import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { describe, expect, it } from 'vitest';
import { ForbiddenError } from './errors';
import { handler } from './handler';

// minimal dummy Fastify instance for binding `this`
function createFakeFastifyInstance(): FastifyInstance {
  return {} as FastifyInstance;
}

// minimal FastifyReply mock that records what was sent
function createReplyMock(): FastifyReply & {
  _getSent(): unknown[];
  _getStatus(): number | null;
} {
  const sent: unknown[] = [];
  let statusCode: number | null = null;

  const reply = {
    send(payload: unknown) {
      sent.push(payload);
      return reply;
    },
    status(code: number) {
      statusCode = code;
      return reply; // Fastify reply.status() is chainable
    },

    // helpers we assert against:
    _getSent() {
      return sent;
    },
    _getStatus() {
      return statusCode;
    },
  } as unknown as FastifyReply & {
    _getSent(): unknown[];
    _getStatus(): number | null;
  };

  return reply;
}

describe('handler wrapper', () => {
  it('sends data on success', async () => {
    const reply = createReplyMock();
    const req: Partial<FastifyRequest> = { query: {}, params: {}, body: {} };
    const fakeApp = createFakeFastifyInstance();

    // route impl returns data
    const wrapped = handler(async (innerReq) => {
      return { ok: true, got: innerReq.query };
    });

    // call the wrapped Fastify handler with a mock this, req, reply
    await wrapped.call(
      fakeApp,
      req as FastifyRequest,
      reply as unknown as FastifyReply,
    );

    expect(reply._getStatus()).toBe(null);
    expect(reply._getSent()).toEqual([{ ok: true, got: {} }]);
  });

  it('maps HttpError -> reply.status(errCode).send({error})', async () => {
    const reply = createReplyMock();
    const req: Partial<FastifyRequest> = { query: {}, params: {}, body: {} };
    const fakeApp = createFakeFastifyInstance();

    const wrapped = handler(async () => {
      throw new ForbiddenError('nah');
    });

    await wrapped.call(
      fakeApp,
      req as FastifyRequest,
      reply as unknown as FastifyReply,
    );

    expect(reply._getStatus()).toBe(403);
    expect(reply._getSent()).toEqual([{ error: 'nah' }]);
  });

  it('maps unknown Error -> 500 Internal Server Error', async () => {
    const reply = createReplyMock();
    const req: Partial<FastifyRequest> = { query: {}, params: {}, body: {} };
    const fakeApp = createFakeFastifyInstance();

    const wrapped = handler(async () => {
      throw new Error('kaboom');
    });

    await wrapped.call(
      fakeApp,
      req as FastifyRequest,
      reply as unknown as FastifyReply,
    );

    expect(reply._getStatus()).toBe(500);
    expect(reply._getSent()).toEqual([{ error: 'Internal Server Error' }]);
  });
});
