import { FastifyPluginAsync } from 'fastify';

const route: FastifyPluginAsync = async (app) => {
  app.get('/health', async () => ({ ok: true, openai: app.hasOpenAI }));
};

export default route;
