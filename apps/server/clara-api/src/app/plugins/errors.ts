import fp from 'fastify-plugin';
import { ZodError } from 'zod';

type PgError = Error & { code?: string; detail?: string; constraint?: string };

export default fp(async (app) => {
  app.setErrorHandler((err: any, _req, reply) => {
    // Zod -> 400
    if (err instanceof ZodError) {
      return reply.code(400).send({
        message: 'Validation failed',
        issues: err.issues.map((i) => ({
          path: i.path.join('.'),
          code: i.code,
          message: i.message,
        })),
      });
    }

    // Postgres error codes
    const pg = err as PgError;
    if (pg.code) {
      switch (pg.code) {
        case '23503': // foreign_key_violation
          return reply.code(409).send({
            message: 'Foreign key violation',
            detail: pg.detail,
            constraint: pg.constraint,
          });
        case '23505': // unique_violation
          return reply.code(409).send({
            message: 'Duplicate key',
            detail: pg.detail,
            constraint: pg.constraint,
          });
        case '23514': // check_violation (e.g., invalid stage)
          return reply.code(400).send({
            message: 'Constraint failed',
            detail: pg.detail,
            constraint: pg.constraint,
          });
        case '22P02': // invalid_text_representation (bad UUID/date, etc.)
          return reply.code(400).send({
            message: 'Invalid value',
            detail: pg.detail,
          });
      }
    }

    // Fallback
    app.log.error({ err }, 'unhandled-error');
    return reply.code(500).send({ message: 'Internal error' });
  });
});
