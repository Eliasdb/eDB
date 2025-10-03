import type { FastifyPluginAsync } from 'fastify';
import { z } from 'zod';
import { executeToolRouted } from '../../app/services/tools';

const ExecBody = z.object({
  name: z.string().min(1),
  args: z.unknown().optional(),
});

const route: FastifyPluginAsync = async (app) => {
  app.post('/realtime/execute-tool', async (req, reply) => {
    const { name, args } = ExecBody.parse(req.body); // body is already parsed

    try {
      // Pass Fastify instance for modules that need it (e.g., HubSpot)
      const output = await executeToolRouted(name, args, { app });
      return reply.send({ ok: true, output });
    } catch (e: any) {
      return reply
        .code(400)
        .send({ ok: false, error: e?.message ?? 'exec_failed' });
    }
  });
};

export default route;
