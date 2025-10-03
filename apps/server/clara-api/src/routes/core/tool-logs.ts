import type { FastifyPluginAsync } from 'fastify';
import { clear, page } from '../../app/services/tools/tool-logger';

const route: FastifyPluginAsync = async (app) => {
  // GET /realtime/tool-logs?offset=0&limit=10  (newest first)
  app.get('/realtime/tool-logs', {
    schema: {
      querystring: {
        type: 'object',
        properties: {
          offset: { type: 'integer', minimum: 0 },
          limit: { type: 'integer', minimum: 1, maximum: 100 },
        },
      },
    },
    handler: async (req, reply) => {
      const { offset, limit } = req.query as {
        offset?: number;
        limit?: number;
      };
      const payload = page({ offset, limit });
      return reply.send(payload);
    },
  });

  // DELETE /realtime/tool-logs -> clears buffer
  app.delete('/realtime/tool-logs', async (_req, reply) => {
    clear();
    return reply.send({ ok: true });
  });
};

export default route;
