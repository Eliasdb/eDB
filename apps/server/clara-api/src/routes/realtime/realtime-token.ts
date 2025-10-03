import { FastifyPluginAsync } from 'fastify';

const route: FastifyPluginAsync = async (app) => {
  app.post('/token', async (_req, reply) => {
    // For OpenAI Realtime you typically mint a short-lived token on server.
    // If you're proxying directly, you can also return the target URL here.
    if (!app.hasOpenAI) return reply.send({ enabled: false });

    // You can just pipe your server key here (NOT for production).
    // In prod: create ephemeral tokens via your gateway or use server-side proxy.
    return reply.send({
      enabled: true,
      url: 'https://api.openai.com/v1/realtime?model=gpt-4o-realtime-preview',
      token: process.env.OPENAI_API_KEY, // TODO: replace with ephemeral
    });
  });
};

export default route;
