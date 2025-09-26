import fp from 'fastify-plugin';
import OpenAI from 'openai';

declare module 'fastify' {
  interface FastifyInstance {
    openai?: OpenAI;
    hasOpenAI: boolean;
  }
}

export const openAIPlugin = fp(async (app) => {
  const key = process.env.OPENAI_API_KEY;
  app.decorate('hasOpenAI', !!key);
  if (key) {
    app.decorate('openai', new OpenAI({ apiKey: key }));
    app.log.info('OpenAI enabled');
  } else {
    app.log.warn('OpenAI disabled (no OPENAI_API_KEY)');
  }
});
