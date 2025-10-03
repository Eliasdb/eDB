import type { FastifyPluginAsync } from 'fastify';
import { allSpecsForRealtime } from '../../app/services/tools';

const route: FastifyPluginAsync = async (app) => {
  app.get('/tools', async (_req, reply) => {
    const tools = allSpecsForRealtime();
    const instructions =
      'You are Clara. When the user asks to create/update/list tasks, contacts, or companies, ALWAYS call the correct tool immediately, then confirm briefly. Default to English unless told otherwise.';
    return reply.send({ tools, instructions });
  });
};

export default route;
