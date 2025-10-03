import type { FastifyPluginAsync } from 'fastify';

import hubRoutes from './hub';
import usersRoutes from './users';

const crm: FastifyPluginAsync = async (app) => {
  await app.register(hubRoutes, { prefix: '/' });
  await app.register(usersRoutes, { prefix: '/' });
};

export default crm;
