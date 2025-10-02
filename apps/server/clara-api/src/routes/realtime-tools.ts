import type { FastifyPluginAsync } from 'fastify';
import { toolSpecsForRealtime } from '../app/services/tools';

const route: FastifyPluginAsync = async (app) => {
  // Tool specs + Clara instructions for the Realtime session
  app.get('/realtime/tools', async (_req, reply) => {
    const tools = toolSpecsForRealtime();
    const instructions =
      'You are Clara. When the user asks to create/update/list tasks, contacts, or companies, ALWAYS call the correct tool immediately, then give a short confirmation. Keep replies concise. Speak and transcribe in English unless told otherwise.';
    return reply.send({ tools, instructions });
  });
};

export default route;
