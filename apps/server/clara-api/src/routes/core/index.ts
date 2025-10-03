import type { FastifyPluginAsync } from 'fastify';

import healthRoutes from './health';
import rootRoutes from './root';
import toolLogsRoutes from './tool-logs';

const core: FastifyPluginAsync = async (app) => {
  // 🏠 Root
  await app.register(rootRoutes, { prefix: '/' });

  // ❤️ Health
  await app.register(healthRoutes, { prefix: '/' });

  // 🔎 Tool logs
  await app.register(toolLogsRoutes, { prefix: '/' });
};

export default core;
