import { describe, expect, it } from 'vitest';
import {
  BadRequestError,
  ForbiddenError,
  HttpError,
  NotFoundError,
  toErrorResponse,
  UnauthorizedError,
} from './errors';

describe('errors', () => {
  it('HttpError stores statusCode and message', () => {
    const err = new HttpError(418, 'I am a teapot');
    expect(err.statusCode).toBe(418);
    expect(err.message).toBe('I am a teapot');
  });

  it('subclasses have correct defaults', () => {
    expect(new BadRequestError().statusCode).toBe(400);
    expect(new UnauthorizedError().statusCode).toBe(401);
    expect(new ForbiddenError().statusCode).toBe(403);
    expect(new NotFoundError().statusCode).toBe(404);
  });

  it('toErrorResponse maps HttpError to statusCode/body', () => {
    const err = new ForbiddenError('nope');
    const { statusCode, body } = toErrorResponse(err);

    expect(statusCode).toBe(403);
    expect(body).toEqual({ error: 'nope' });
  });

  it('toErrorResponse maps unknown Error to 500/Internal Server Error', () => {
    const err = new Error('boom');
    const { statusCode, body } = toErrorResponse(err);

    expect(statusCode).toBe(500);
    expect(body).toEqual({ error: 'Internal Server Error' });
  });
});
