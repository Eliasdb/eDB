import { FastifyPluginAsync } from 'fastify';
import { z } from 'zod';

// Dumb executor stub – later map to HubSpot/SFDC/etc.
const actionSchema = z.object({
  type: z.enum(['create_task', 'create_contact', 'create_company']),
  payload: z.record(z.any()),
});

const route: FastifyPluginAsync = async (app) => {
  app.post('/actions', async (req, reply) => {
    const a = actionSchema.parse(req.body);
    app.log.info({ a }, 'Action received');

    // For now: ACK only
    return reply.send({ ok: true });
  });
};

export default route;
