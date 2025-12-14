// apps/server/clara-api/src/app/plugins/auth.ts
import type { FastifyPluginAsync, FastifyReply, FastifyRequest } from 'fastify';
import fp from 'fastify-plugin';

export const authPlugin: FastifyPluginAsync = fp(async (app) => {
  // (optional) declare at runtime that requests can have `user`.
  app.decorateRequest('user', null);

  app.addHook(
    'preHandler',
    async (_req: FastifyRequest, _reply: FastifyReply) => {
      // const token = (req.headers.authorization ?? '').replace(/^Bearer\s+/i,'');
      // if (!token) throw app.httpErrors.unauthorized();
      // req.user = { id: 'demo' };
    },
  );
});
