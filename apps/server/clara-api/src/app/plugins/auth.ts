import fp from 'fastify-plugin';

export const authPlugin = fp(async (app) => {
  app.addHook('preHandler', async (req, _reply) => {
    // If you want a quick bearer check, uncomment:
    // const token = (req.headers.authorization ?? '').replace(/^Bearer\s+/i,'');
    // if (!token) throw app.httpErrors.unauthorized();
    // req.user = { id: 'demo' };
  });
});
