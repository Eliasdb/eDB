import type { FastifyPluginAsync } from 'fastify';

import realtimeExecRoutes from './realtime-exec';
import realtimeTokenRoutes from './realtime-token';
import realtimeToolsRoutes from './realtime-tools';

const realtime: FastifyPluginAsync = async (app) => {
  await app.register(realtimeTokenRoutes, { prefix: '/realtime' });
  await app.register(realtimeExecRoutes, { prefix: '/realtime' });
  await app.register(realtimeToolsRoutes, { prefix: '/realtime' });
};

export default realtime;
