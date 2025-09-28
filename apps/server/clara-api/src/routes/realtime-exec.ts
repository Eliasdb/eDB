// apps/server/clara-api/src/routes/realtime-exec.ts
import type { FastifyPluginAsync } from 'fastify';
import { z } from 'zod';
import { executeTool } from '../app/services/tools';

const ExecBody = z.object({
  name: z.string().min(1),
  args: z.unknown().optional(),
});

const route: FastifyPluginAsync = async (app) => {
  // apps/server/clara-api/src/routes/realtime-exec.ts
  app.post('/realtime/execute-tool', async (req, reply) => {
    const { name, args } = ExecBody.parse(await req.body);
    try {
      const out = await executeTool(name, args);
      return reply.send({ ok: true, output: out });
    } catch (e: any) {
      return reply
        .code(400)
        .send({ ok: false, error: e?.message ?? 'exec_failed' });
    }
  });
};

export default route;
