import type { FastifyPluginAsync } from 'fastify';
import { all, clear } from '../app/services/toolLog';

const route: FastifyPluginAsync = async (app) => {
  // list latest tool invocations (newest first)
  app.get('/realtime/tool-logs', async (_req, reply) => {
    return reply.send({ items: all() });
  });

  // clear the in-memory buffer
  app.delete('/realtime/tool-logs', async (_req, reply) => {
    clear();
    return reply.send({ ok: true });
  });
};

export default route;
